import { string, object, TypeOf } from 'zod';

// schema para validacao do input para criar usuario
export const createUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email é obrigatório',
    }).email('Email invalido'),
    firstName: string({
      required_error: 'FirstName é obrigatório',
    }),
    lastName: string({
      required_error: 'LastName é obrigatório',
    }),
    password: string({
      required_error: 'Password é obrigatório',
    }).min(6, 'Password muito curto - deve ser no min 6 chars'),
    passwordRepeat: string({
      required_error: 'PasswordRepeat é obrigatório',
    }),
  }).refine((data) => data.password === data.passwordRepeat, {
    message: 'Passwords devem ser iguais',
    path: ['passwordRepeat'],
  }),
});

// schema para verificacao de email
export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

// schema para reenviar info para verificacao de email
export const resendVerifySchema = object({
  body: object({
    email: string({
      required_error: 'Email é obrigatório',
    }),
  }),
});

// schema para solicitar mudanca de senha
export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email é obrigatório',
    }),
  }),
});

// schema para alterar senha
export const resetPasswordSchema = object({
  params: object({
    id: string(),
    resetPasswordCode: string(),
  }),
  body: object({
    password: string({
      required_error: 'Password é obrigatório',
    }).min(6, 'Password muito curto - deve ser no min 6 chars'),
    passwordRepeat: string({
      required_error: 'PasswordRepeat é obrigatório',
    }),
  }).refine((data) => data.password === data.passwordRepeat, {
    message: 'Passwords devem ser iguais',
    path: ['passwordRepeat'],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];
export type ResendVerifyInput = TypeOf<typeof resendVerifySchema>['body'];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
