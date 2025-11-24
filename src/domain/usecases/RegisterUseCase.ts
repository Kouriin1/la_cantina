import { User } from '../entities/User';
import { AuthRepository } from '../repositories/AuthRepository';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(userData: Omit<User, 'id'> & { password: string }): Promise<User> {
    return this.authRepository.register(userData);
  }
}
