import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

// valida os recursos vindo atraves do request baseado nos esquemas
export const validateResouce =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const msg = error.issues.map((issue: any) => {
        return { path: issue.path[1], message: issue.message };
      });
      res.status(400).json({ msg });
    }
  };
