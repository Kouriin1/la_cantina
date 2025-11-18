import { TokenRepository } from '../repositories/TokenRepository';
import { TokenTransaction } from '../entities/TokenTransaction';

export class GetTransactionsByUserUseCase {
  constructor(private tokenRepository: TokenRepository) {}

  execute(userId: string): Promise<TokenTransaction[]> {
    return this.tokenRepository.getTransactionsByUser(userId);
  }
}
