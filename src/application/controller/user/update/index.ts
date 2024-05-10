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
import { hasUserByEmail, userIsOwner } from '@application/helper';
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
  phone?: string;
}

/**
 * @typedef {object} UpdateUserBody
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} phone
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
 * @param {UpdateUserBody} request.body
 * @param {string} id.path.required
 * @return {UpdateUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      if (!userIsOwner(request))
        return forbidden({
          message: { english: 'update this user', portuguese: 'atualizar este usuário' },
          response
        });

      await updateUserSchema.validate(request, { abortEarly: false });

      const { email, name, password, phone } = request.body as Body;

      if (await hasUserByEmail(email))
        return badRequest({ message: messages.auth.userAlreadyExists, response });

      let newPassword: string | undefined;

      if (typeof password === 'string') {
        const { HASH_SALT } = env;

        const hashedPassword = await hash(password, HASH_SALT);

        newPassword = hashedPassword;
      }

      let newPhone: string | undefined;

      if (typeof phone === 'string') newPhone = phone.replace(/\D/gu, '');

      const payload = await DataSource.user.update({
        data: { email, name, password: newPassword, phone: newPhone },
        select: userFindParams,
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
