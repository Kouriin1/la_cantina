import { TokenTransaction, TransactionType } from '../../domain/entities/TokenTransaction';
import { toUser, fromUser, UserModel } from './UserModel';

export interface TokenTransactionModel {
  id: string;
  user: UserModel;
  type: TransactionType;
  amount: number;
  createdAt: number; // timestamp
}

export const toTokenTransaction = (transactionModel: TokenTransactionModel): TokenTransaction => ({
  id: transactionModel.id,
  user: toUser(transactionModel.user),
  type: transactionModel.type,
  amount: transactionModel.amount,
  createdAt: new Date(transactionModel.createdAt),
});

export const fromTokenTransaction = (transaction: TokenTransaction): TokenTransactionModel => ({
  id: transaction.id,
  user: fromUser(transaction.user),
  type: transaction.type,
  amount: transaction.amount,
  createdAt: transaction.createdAt.getTime(),
});
