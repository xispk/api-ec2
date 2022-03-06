import express from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = express.Router();

// rota para verificar saude da api
router.get('/healthcheck', (_, res) => res.sendStatus(200));

// rotas relacionadas a criacao e alteracao de info do usuario
router.use(userRoutes);

// rotas relacionadas a autenticacao do usuario
router.use(authRoutes);

export default router;
