import { User } from './User';

export type TransactionType = 'recharge' | 'purchase';

export interface TokenTransaction {
  id: string;
  user: User;
  type: TransactionType;
  amount: number;
  createdAt: Date;
}
