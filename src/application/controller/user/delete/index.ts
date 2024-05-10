import { DataSource } from '@infra/database';
import { badRequest, errorLogger, forbidden, ok } from '@main/utils';
import { messages } from '@domain/helpers';
import { userFindParams } from '@data/search';
import { userIsOwner } from '@application/helper';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} DeleteUserResponse
 * @property {Messages} message
 * @property {string} status
 */

/**
 * DELETE /user/{id}
 * @summary Delete User
 * @tags User
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {DeleteUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      if (!userIsOwner(request))
        return forbidden({
          message: { english: 'delete this user', portuguese: 'deletar este usuário' },
          response
        });

      const payload = await DataSource.user.update({
        data: { finishedAt: new Date() },
        select: userFindParams,
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return badRequest({ message: messages.auth.notFound, response });
    }
  };
