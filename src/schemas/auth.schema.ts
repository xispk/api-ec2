import { string, object, TypeOf } from 'zod';

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: 'Eamil é obrigatório',
    }),
    password: string({
      required_error: 'Password é obrigatório',
    }),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];
