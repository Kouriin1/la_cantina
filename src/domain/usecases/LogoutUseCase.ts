import { AuthRepository } from '../repositories/AuthRepository';

export class LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
