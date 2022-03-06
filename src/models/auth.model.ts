import mongoose from 'mongoose';

export interface SessionInput {
  user: mongoose.Types.ObjectId;
  isValid: boolean;
}

export interface Session extends SessionInput {
  _id: mongoose.Types.ObjectId;
}

// schema de usuario para acesso ao banco de dados
const sessionSchema = new mongoose.Schema<Session>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isValid: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model<Session>('Session', sessionSchema);

export default SessionModel;
