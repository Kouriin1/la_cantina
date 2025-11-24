import { TokenRepository } from '../../domain/repositories/TokenRepository';
import { TokenTransaction } from '../../domain/entities/TokenTransaction';
import mockApi from '../services/ApiService';
import { TokenTransactionModel, toTokenTransaction } from '../models/TokenTransactionModel';
import { UserModel } from '../models/UserModel';

const mockUser: UserModel = {
  id: 'student1',
  email: 'student@test.com',
  role: 'student',
  firstName: 'Student',
  lastName: 'User',
  parentId: 'parent1',
};

const mockTransactions: TokenTransactionModel[] = [
  { id: '1', user: mockUser, type: 'recharge', amount: 100, createdAt: new Date().getTime() },
  { id: '2', user: mockUser, type: 'purchase', amount: -8.98, createdAt: new Date().getTime() },
];

export class TokenRepositoryImpl implements TokenRepository {
  async getTokenBalance(userId: string): Promise<number> {
    console.log('Getting token balance for user', userId);
    const balance = mockTransactions.reduce((acc, t) => acc + t.amount, 0);
    return mockApi(balance);
  }

  async rechargeTokens(userId: string, amount: number): Promise<TokenTransaction> {
    throw new Error('Method not implemented.');
  }

  async getTransactionsByUser(userId: string): Promise<TokenTransaction[]> {
    console.log('Getting transactions for user', userId);
    const response = await mockApi(mockTransactions);
    return response.map(toTokenTransaction);
  }
}
