import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import mockApi from '../services/ApiService';
import { UserModel, toUser } from '../models/UserModel';

const mockStudent: UserModel = {
  id: 'student1',
  email: 'student@test.com',
  role: 'student',
  firstName: 'Student',
  lastName: 'User',
  parentId: 'parent1',
};

export class UserRepositoryImpl implements UserRepository {
  async getUserById(id: string): Promise<User | null> {
    console.log('Getting user by id', id);
    if (id === 'student1') {
      const response = await mockApi(mockStudent);
      return toUser(response);
    }
    return mockApi(null);
  }

  async updateUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
