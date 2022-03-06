import { Request, Response, NextFunction } from 'express';
import { jwtServices } from '../utils/jwt';

// salva o usuraio em res.locals se ele estiver autenticado
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // pega os tokens pelas headers ou cookies
  const accessToken =
    req.cookies.accessToken ||
    (req.headers.authorization || '').replace(/^Bearer\s/, '');

  const refreshToken =
    req.cookies.refreshToken || (req.headers['x-refresh'] as string);

  // checa se o access token existe
  if (!accessToken) {
    return next();
  }

  // verifica se o token de acesso é valido
  const { decoded, expired } = jwtServices.verify(
    accessToken,
    'access_token_public_key'
  );

  // se o token de refresh existir e se o token de acesso estiver expirado
  if (refreshToken && expired) {
    const accessToken = await jwtServices.reIssueAccessToken(refreshToken);

    if (!accessToken) return next();

    const { decoded } = jwtServices.verify(
      accessToken,
      'access_token_public_key'
    );

    // se o novo token gerado estiver ok
    if (decoded) {
      res.locals.user = decoded;
    }

    // envia o token atraves de headers pro caso de nao quere usar cookies
    res.setHeader('x-access-token', accessToken);

    // envia o token atraves de cookies
    res.cookie('accessToken', accessToken, {
      maxAge: 900000,
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false,
    });

    return next();
  }

  // se o token de acesso atual ainda for valido
  if (decoded) {
    res.locals.user = decoded;
  }
  return next();
};

export default deserializeUser;
