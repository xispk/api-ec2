import { Request, Response } from 'express';
import { CreateSessionInput } from '../schemas/auth.schema';
import { sessionServices } from '../services/auth.services';
import { userServices } from '../services/user.services';
import { jwtServices } from '../utils/jwt';

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) => {
  const { password, email } = req.body;
  try {
    const user = await userServices.findByEmail(email).select('+password');
    // checa se existe um usuario com o email informado
    if (!user) {
      return res.status(400).json({ msg: 'Email ou senha invalido' });
    }

    // checa se a conta ja foi verificada
    if (!user.verified) {
      return res.status(400).json({ msg: 'Usuario não é verificado' });
    }

    // checa se a senha informada é igual a senha armazenada em hash
    const isPasswordValid = await user.comparePasswords(password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: 'Email ou senha invalido' });
    }

    // deleta todas as sessoes anteriores do usuario
    await sessionServices.deleteByUser(user);

    // cria uma nova sessao
    const session = await sessionServices.create(user);

    // versao do usuario que nao contem o hash da senha
    const tokenUser = await userServices.findByEmail(email);
    // gera o token de acesso usando o usuario
    const accessToken = jwtServices.sign(
      tokenUser!,
      'access_token_private_key',
      'access_token_sign_options'
    );

    // gera o token de refresh usando a sessao
    const refreshToken = jwtServices.sign(
      session,
      'refresh_token_private_key',
      'refresh_token_sign_options'
    );

    // gera cookies contendo os tokens criados
    res.cookie('accessToken', accessToken, {
      maxAge: 900000,
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false,
    });

    // enviando tokens para o caso da ui fazer uso dos tokens para localstorage
    res.status(200).json({
      msg: 'Login efetuado com sucesso',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Erro de servidor' });
  }
};
