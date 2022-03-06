import mongoose from 'mongoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface User extends UserInput {
  _id: mongoose.Types.ObjectId;
  verificationCode: string;
  verified: boolean;
  resetPasswordCode: string;
  comparePasswords: (candidatePassword: string) => Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// schema de usuario para acesso ao banco de dados
const userSchema = new mongoose.Schema<User>(
  {
    email: { type: String, required: true, index: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    verificationCode: { type: String, default: () => nanoid() },
    verified: { type: Boolean, default: false },
    resetPasswordCode: String,
  },
  {
    timestamps: true,
  }
);

// funcao de hash pre armazenamento no banco de dados
userSchema.pre('save', async function (next) {
  // se a senha nao tiver sido alterada, apenas ignora
  if (!this.isModified('password')) {
    return next();
  }

  // se a senha tiver sido alterada ou é cadastro novo,
  // faz hash na senha e armazena no banco de dados
  this.password = await argon2.hash(this.password);
});

// metodo que compara a senha informada no input e o hash armazenado
userSchema.methods.comparePasswords = async function (
  inputPassword: string
): Promise<boolean> {
  return await argon2.verify(this.password, inputPassword);
};

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
