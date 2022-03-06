import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResendVerifyInput,
  ResetPasswordInput,
  VerifyUserInput,
} from '../schemas/user.schema';
import { userServices } from '../services/user.services';

// controlador para criar usuarios
export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const input = req.body;
  try {
    const user = await userServices.create(input);

    // envio de email contendo info para verificacao de conta
    userServices.sendVerificationInfo(user);

    // data sendo enviada apenas para testes
    res.status(201).json({
      msg: 'Usuario criado com sucesso',
      data: { id: user._id, verificationCode: user.verificationCode },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ msg: 'Já existe um usuario com esse email' });
    }
    res.status(500).json({ msg: 'Erro de servidor' });
  }
};

// controlador para verificar email
export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response
) => {
  const { id, verificationCode } = req.params;
  try {
    const user = await userServices.findById(id);

    // verifica se existe um usuario com o id informado
    if (!user) {
      return res
        .status(400)
        .json({ msg: 'Dados para verificacao de usuario incorretos' });
    }

    // checa se o usuario ja esta verificado
    if (user.verified) {
      return res.status(400).json({ msg: 'Usuario ja esta verificado' });
    }

    // verifica se o codigo informado é o mesmo armazenado no banco de dados
    if (user.verificationCode !== verificationCode) {
      return res
        .status(400)
        .json({ msg: 'Não foi possivel verificar a conta' });
    }

    // se tudo estiver correto
    user.verified = true;
    user.verificationCode = '';
    await user.save();

    res.status(200).json({ msg: 'Usuario verificado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ msg: 'Erro de servidor' });
  }
};

// controlador para reenviar info para verificacao de email
export const resendVerifyHandler = async (
  req: Request<{}, {}, ResendVerifyInput>,
  res: Response
) => {
  const { email } = req.body;
  try {
    const msg = 'Informações enviadas para o email informado';
    const user = await userServices.findByEmail(email);
    // verifica se existe um usuario com o email informado
    if (!user) {
      return res.status(400).json({ msg });
    }

    // checa se o usuario ja esta verificado
    if (user.verified) {
      return res.status(400).json({ msg: 'Usuario ja está verificado' });
    }

    // envio de email contendo info para verificacao de conta
    userServices.sendVerificationInfo(user);

    // data sendo enviado apenas para testes
    res.status(200).json({
      msg,
      data: { id: user._id, verificationCode: user.verificationCode },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Erro de servidor' });
  }
};

// controlador para solicitar alteracao de senha
export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  const { email } = req.body;
  try {
    const msg =
      'Informações para alterar senha enviadas para o email informado';
    const user = await userServices.findByEmail(email);
    /// verifica se existe um usuario com o email informado
    if (!user) {
      return res.status(400).json({ msg });
    }

    // checa se o usuario ja esta verificado
    if (!user.verified) {
      return res.status(400).json({ msg: 'Usuario não está verificado' });
    }

    // cria e adiciona o codigo de alteracao na conta
    user.resetPasswordCode = nanoid();
    await user.save();

    // data sendo enviada apenas para testes
    res.status(200).json({
      msg,
      data: { id: user._id, resetPasswordCode: user.resetPasswordCode },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Erro de servidor' });
  }
};

// controlador para alterar senha
export const resetPasswordHandler = async (
  req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
  res: Response
) => {
  const { id, resetPasswordCode } = req.params;
  const { password } = req.body;
  try {
    const user = await userServices.findById(id);

    // checa se existe um usuario com o id informado
    if (!user) {
      return res.status(400).json({ msg: 'Não foi possivel alterar a senha' });
    }

    // checa se o codigo é valido e se ele é o mesmo armazenado no db
    if (
      !user.resetPasswordCode ||
      user.resetPasswordCode !== resetPasswordCode
    ) {
      return res.status(400).json({ msg: 'Não foi possivel alterar a senha' });
    }

    // altera a senha do usuario
    user.password = password;
    user.resetPasswordCode = '';
    await user.save();

    res.status(200).json({ msg: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ msg: 'Erro de servidor' });
  }
};

// controlador que envia o usuario atual conectado
export const meHandler = (_: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) return res.status(400).json({ msg: 'Acesso negado' });
  res.status(200).json({ msg: 'Usuario enviado com sucesso', data: user });
};
