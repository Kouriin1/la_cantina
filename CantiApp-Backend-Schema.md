# CantiApp Backend and Database

## Database Schema

Here is a suggested database schema for CantiApp. This can be implemented in Firestore (NoSQL) or a relational database like PostgreSQL (used by Supabase).

### Users Collection/Table

This table stores user information for all roles.

- **id**: `string` (Primary Key)
- **email**: `string` (Unique)
- **role**: `string` ('student', 'parent', 'cafeteria')
- **firstName**: `string`
- **lastName**: `string`
- **parentId**: `string` (Foreign Key to Users table, for students)
- **childId**: `string` (Foreign Key to Users table, for parents)
- **createdAt**: `timestamp`

### Products Collection/Table

This table stores information about the products sold in the cafeteria.

- **id**: `string` (Primary Key)
- **name**: `string`
- **description**: `string`
- **price**: `number`
- **cost**: `number`
- **imageUrl**: `string`
- **stock**: `number`
- **createdAt**: `timestamp`

### Orders Collection/Table

This table stores information about student orders.

- **id**: `string` (Primary Key)
- **studentId**: `string` (Foreign Key to Users table)
- **total**: `number`
- **status**: `string` ('pending_approval', 'pending_payment', 'approved', 'rejected_by_parent', 'preparing', 'ready_for_pickup', 'completed', 'cancelled_by_cafeteria')
- **items**: `array` of objects (In NoSQL) or a separate OrderItems table (In SQL)
  - **productId**: `string`
  - **quantity**: `number`
  - **price**: `number`
- **createdAt**: `timestamp`
- **updatedAt**: `timestamp`

### TokenTransactions Collection/Table

This table stores the history of token transactions.

- **id**: `string` (Primary Key)
- **userId**: `string` (Foreign Key to Users table, for the user who performed the transaction)
- **type**: `string` ('recharge', 'purchase')
- **amount**: `number` (Can be positive for recharges, negative for purchases)
- **orderId**: `string` (Foreign Key to Orders table, for purchase transactions)
- **createdAt**: `timestamp`

### Wallets Collection/Table

This table stores the token balance for each student.

- **id**: `string` (Primary Key, can be the same as the student's userId)
- **userId**: `string` (Foreign Key to Users table)
- **balance**: `number`
- **updatedAt**: `timestamp`

## Firebase/Supabase Implementation

Here are examples of how to implement the authentication and real-time notifications.

### Authentication with Roles

Both Firebase and Supabase support custom claims or roles for users.

**Supabase Example:**

When a user signs up, you can store their role in a public `profiles` table.

```typescript
// Example of registering a user with a role in Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

async function registerWithRole(email, password, role, firstName, lastName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error('Error signing up:', error);
    return null;
  }

  return data.user;
}
```

**Firebase Example:**

You can use Firebase Cloud Functions to set custom claims on a user object when it's created.

```javascript
// Firebase Cloud Function to set a custom role
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addRole = functions.https.onCall(async (data, context) => {
  // Check if the request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { uid, role } = data;

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return { message: `Success! ${uid} has been made a ${role}.` };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'An error occurred while setting the custom claim.');
  }
});
```

### Real-time Notifications

**Firebase Cloud Messaging (FCM):**

FCM is the standard way to send push notifications with Firebase.

1.  **Set up FCM** in your Firebase project and in your React Native app.
2.  **Store FCM tokens:** When a user logs in, get their FCM token and save it to their user profile in the database.
3.  **Trigger notifications:** Use Cloud Functions to send notifications based on database events.

```javascript
// Firebase Cloud Function to send a notification when an order needs approval
exports.notifyParentOnNewOrder = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();

    // Get the student and parent data
    const student = await admin.firestore().collection('users').doc(order.studentId).get();
    const parentId = student.data().parentId;
    const parent = await admin.firestore().collection('users').doc(parentId).get();
    const parentFcmToken = parent.data().fcmToken;

    if (parentFcmToken) {
      const payload = {
        notification: {
          title: 'Purchase Request',
          body: `${student.data().firstName} wants to buy food.`,
        },
      };

      await admin.messaging().sendToDevice(parentFcmToken, payload);
    }
  });
```

**Supabase Realtime:**

Supabase has a built-in Realtime engine that you can use to listen for database changes.

1.  **Enable Realtime** for your tables in the Supabase dashboard.
2.  **Subscribe to changes** in your app.

```typescript
// Example of listening for new orders in the parent's app
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

const subscription = supabase
  .channel('public:orders')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
    console.log('New order received!', payload.new);
    // Trigger a local notification
  })
  .subscribe();
```
