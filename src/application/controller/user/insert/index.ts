import { DataSource } from '@infra/database';
import { ValidationError } from 'yup';
import {
  badRequest,
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '@main/utils';
import { env } from '@main/config';
import { hash } from 'bcrypt';
import { insertUserSchema } from '@data/validation';
import { messages } from '@domain/helpers';
import { userFindParams } from '@data/search';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  email: string;
  name: string;
  password: string;
  phone: string;
}

/**
 * @typedef {object} InsertUserProps
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 * @property {string} phone.required
 */

/**
 * @typedef {object} InsertUserResponse
 * @property {Messages} message
 * @property {string} status
 * @property {User} payload
 */

/**
 * POST /user
 * @summary Insert User
 * @tags User
 * @example request - payload example
 * {
 *   "name": "test",
 *   "email": "test@test",
 *   "password": "test@123"
 * }
 * @param {InsertUserProps} request.body.required
 * @return {InsertUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertUserSchema.validate(request, { abortEarly: false });

      const { email, name, password, phone } = request.body as Body;

      const hasUser = await DataSource.user.findUnique({
        select: {
          id: true
        },
        where: {
          email
        }
      });

      if (hasUser !== null)
        return badRequest({ message: messages.auth.userAlreadyExists, response });

      const { HASH_SALT } = env;

      const hashedPassword = await hash(password, HASH_SALT);

      const payload = await DataSource.user.create({
        data: { email, name, password: hashedPassword, phone },
        select: userFindParams
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
