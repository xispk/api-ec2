import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import log from './logger';
import { sessionServices } from '../services/auth.services';
import { userServices } from '../services/user.services';

// assina um novo json web token
const sign = (
  payload: Object,
  keyName: 'access_token_private_key' | 'refresh_token_private_key',
  optionsName: 'access_token_sign_options' | 'refresh_token_sign_options'
) => {
  const privateKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');

  const signOptions = config.get<jwt.SignOptions>(optionsName);

  try {
    return jwt.sign({ payload }, privateKey, signOptions);
  } catch (error) {
    log.error(error);
  }
};

// verifica se o token é valido
const verify = (
  token: string,
  keyName: 'access_token_public_key' | 'refresh_token_public_key'
) => {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString(
    'ascii'
  );

  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    log.error(error.message);
    // se houver um erro e o erro for de expiracao
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
};

export const reIssueAccessToken = async (refreshToken: string) => {
  // checa se o token é valido
  const { decoded } = verify(refreshToken, 'refresh_token_public_key');

  if (!decoded) return false;
  // checa se a sessao é valida
  const session = await sessionServices.findById((decoded as JwtPayload)._id);

  if (!session || !session.isValid) return false;
  // checa se o usuario é valido

  const user = await userServices.findById(String(session.user));

  if (!user) return false;

  // assina um novo token de acesso
  const accessToken = sign(
    user,
    'access_token_private_key',
    'access_token_sign_options'
  );

  return accessToken;
};

export const jwtServices = {
  sign,
  verify,
  reIssueAccessToken,
};
