export type UserRole = 'student' | 'parent' | 'cafeteria';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  // For students
  parentId?: string;
  // For parents
  childId?: string;
}
