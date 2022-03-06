import express from 'express';
import {
  createUserHandler,
  forgotPasswordHandler,
  meHandler,
  resendVerifyHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controllers/user.controller';
import { validateResouce } from '../middlewares/validateResources';
import {
  createUserSchema,
  forgotPasswordSchema,
  resendVerifySchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../schemas/user.schema';

const router = express.Router();

// rota para criar usuarios
router.post('/api/users', validateResouce(createUserSchema), createUserHandler);

// rota para verificacao de email
router.get(
  '/api/users/verify/:id/:verificationCode',
  validateResouce(verifyUserSchema),
  verifyUserHandler
);

// rota para reenviar info para verificacao de email
router.post(
  '/api/users/resendverify',
  validateResouce(resendVerifySchema),
  resendVerifyHandler
);

// rota para solicitar alteracao de senha
router.post(
  '/api/users/forgotpassword',
  validateResouce(forgotPasswordSchema),
  forgotPasswordHandler
);

// rota para alterar senha
router.post(
  '/api/users/resetpassword/:id/:resetPasswordCode',
  validateResouce(resetPasswordSchema),
  resetPasswordHandler
);

router.get('/api/users/me', meHandler);

export default router;
