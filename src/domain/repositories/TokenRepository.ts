import { TokenTransaction } from '../entities/TokenTransaction';

export interface TokenRepository {
  getTokenBalance(userId: string): Promise<number>;
  rechargeTokens(userId: string, amount: number): Promise<TokenTransaction>;
  getTransactionsByUser(userId: string): Promise<TokenTransaction[]>;
}
