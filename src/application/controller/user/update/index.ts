/* eslint-disable @typescript-eslint/init-declarations */
import { DataSource } from '@infra/database';
import { ValidationError } from 'yup';
import {
  badRequest,
  errorLogger,
  forbidden,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '@main/utils';
import { env } from '@main/config';
import { hash } from 'bcrypt';
import { messages } from '@domain/helpers';
import { updateUserSchema } from '@data/validation';
import { userFindParams } from '@data/search';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  password?: string;
  email?: string;
  name?: string;
}

/**
 * @typedef {object} UpdateUserProps
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {object} UpdateUserResponse
 * @property {Messages} message
 * @property {string} status
 * @property {User} payload
 */

/**
 * PUT /user/{id}
 * @summary Update User
 * @tags User
 * @security BearerAuth
 * @param {UpdateUserProps} request.body
 * @param {string} id.path.required
 * @return {UpdateUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      if (Number(request.params.id) !== Number(request.user.id))
        return forbidden({
          message: {
            english: 'update this user',
            portuguese: 'atualizar este usuário'
          },
          response
        });

      await updateUserSchema.validate(request, { abortEarly: false });

      const { email, name, password } = request.body as Body;

      if (typeof email !== 'undefined') {
        const hasUser = await DataSource.user.findUnique({
          select: {
            id: true
          },
          where: {
            email
          }
        });

        if (hasUser !== null && hasUser.id !== Number(request.params.id))
          return badRequest({ message: messages.auth.userAlreadyExists, response });
      }

      let newPassword: string | undefined;

      if (typeof password !== 'undefined') {
        const { HASH_SALT } = env;

        const hashedPassword = await hash(password, HASH_SALT);

        newPassword = hashedPassword;
      }

      const payload = await DataSource.user.update({
        data: { email, name, password: newPassword },
        select: userFindParams,
        where: {
          id: Number(request.params.id)
        }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
