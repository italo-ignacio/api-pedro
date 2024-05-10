import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import { addressFindParams } from '@data/search';
import { errorLogger, forbidden, messageErrorResponse, notFound, ok } from '@main/utils';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneAddressResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Address} payload
 */

/**
 * GET /address/{id}
 * @summary Find one Address (Only Admin)
 * @tags Address
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {FindOneAddressResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneAddressController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      if (request.user.role !== Role.admin)
        return forbidden({
          message: {
            english: 'access this route',
            portuguese: 'acessar esta rota'
          },
          response
        });

      const payload = await DataSource.address.findUnique({
        select: addressFindParams,
        where: { id: Number(request.params.id) }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Address', portuguese: 'Endereço' },
          response
        });

      return ok({
        payload,
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
