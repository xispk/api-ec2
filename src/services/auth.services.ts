import SessionModel from '../models/auth.model';
import { User } from '../models/user.model';

const create = (user: User) => {
  return SessionModel.create({ user: user._id });
};

const findById = (id: string) => {
  return SessionModel.findById(id);
};

const deleteByUser = (user: User) => {
  return SessionModel.deleteMany({ user: user._id });
};

export const sessionServices = {
  create,
  findById,
  deleteByUser,
};
