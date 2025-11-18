import { AuthRepository } from '../repositories/AuthRepository';
import { User } from '../entities/User';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(userData: Omit<User, 'id'>): Promise<User> {
    return this.authRepository.register(userData);
  }
}
