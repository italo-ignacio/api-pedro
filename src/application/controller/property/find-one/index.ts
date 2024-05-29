import { DataSource } from '@infra/database';
import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { propertyFindParams } from '@data/search';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOnePropertyResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Property} payload
 */

/**
 * GET /property/{id}
 * @summary Find one Property
 * @tags Property
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {FindOnePropertyResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOnePropertyController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.property.findUnique({
        select: propertyFindParams,
        where: { id: Number(request.params.id) }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Property', portuguese: 'Propriedade' },
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
