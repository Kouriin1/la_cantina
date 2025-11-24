// This is a mock API service.
// In a real application, you would use a library like axios or fetch to make HTTP requests to your backend.
// For this example, we'll just simulate the API calls with timeouts.

const mockApi = <T>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export default mockApi;
