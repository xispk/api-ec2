require('dotenv').config();
import express from 'express';
import config from 'config';
import cookieParser from 'cookie-parser';
import connectDB from './utils/connect';
import log from './utils/logger';
import router from './routes';
import deserializeUser from './middlewares/deserializeUser';

// servidor
const app = express();

// middleware para administrar cookies
app.use(cookieParser());

// middleware que converte o body para json
app.use(express.json());

// se o usuario estiver autenticado, salva o usuario em res.locals
app.use(deserializeUser);

// usando as rotas criadas como middlewares
app.use(router);

const port = config.get<number>('port');

// iniciando o servidor
app.listen(port, async () => {
  log.info(`Server is running on port ${port}`);
  // conectando ao banco de dados
  await connectDB();
});
