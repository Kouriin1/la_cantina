import { User } from '../entities/User';

export interface AuthRepository {
  login(email: string, password: string): Promise<User>;
  register(userData: Omit<User, 'id'>): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
