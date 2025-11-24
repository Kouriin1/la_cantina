import { User, UserRole } from '../../domain/entities/User';

export interface UserModel {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  parentId?: string;
  childId?: string;
}

export const toUser = (userModel: UserModel): User => ({
  id: userModel.id,
  email: userModel.email,
  role: userModel.role,
  firstName: userModel.firstName,
  lastName: userModel.lastName,
  parentId: userModel.parentId,
  childId: userModel.childId,
});

export const fromUser = (user: User): UserModel => ({
  id: user.id,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  parentId: user.parentId,
  childId: user.childId,
});
