import UserModel, { User, UserInput } from '../models/user.model';
import config from 'config';
import sendEmail from '../utils/sendMail';

const create = (input: UserInput) => {
  const newUser = UserModel.create(input);
  return newUser;
};

const findById = (id: string) => {
  const user = UserModel.findById(id);

  return user;
};

export const findByEmail = (email: string) => {
  const user = UserModel.findOne({ email });

  return user;
};

export const sendVerificationInfo = (user: User) => {
  const port = config.get<number>('port');
  const host = config.get<string>('host');

  sendEmail({
    from: config.get<string>('senderMail'),
    to: user.email,
    subject: 'Verificação de email - API test ec2-aws',
    text: `${host}:${port}/api/users/verify/${user._id}/${user.verificationCode}`,
  });
};

export const userServices = {
  create,
  findById,
  findByEmail,
  sendVerificationInfo,
};
