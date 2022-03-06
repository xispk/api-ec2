import express from 'express';
import { createSessionHandler } from '../controllers/auth.controller';
import { validateResouce } from '../middlewares/validateResources';
import { createSessionSchema } from '../schemas/auth.schema';

const router = express.Router();

// rota para fazer login
router.post(
  '/api/auth/login',
  validateResouce(createSessionSchema),
  createSessionHandler
);

export default router;
