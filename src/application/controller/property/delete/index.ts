import { DataSource } from '@infra/database';
import { errorLogger, forbidden, messageErrorResponse, ok } from '@main/utils';
import { propertyFindParams } from '@data/search';
import { userIsOwnerOfProperty } from '@application/helper';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} DeletePropertyResponse
 * @property {Messages} message
 * @property {string} status
 */

/**
 * DELETE /property/{id}
 * @summary Delete Property
 * @tags Property
 * @security BearerAuth
 * @param {integer} id.path.required
 * @return {DeletePropertyResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deletePropertyController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      if (!(await userIsOwnerOfProperty(request)))
        return forbidden({
          message: { english: 'delete this property', portuguese: 'deletar esta propriedade' },
          response
        });

      const payload = await DataSource.property.update({
        data: {
          address: { update: { finishedAt: new Date() } },
          finishedAt: new Date(),
          flocks: {
            updateMany: {
              data: { finishedAt: new Date() },
              where: { propertyId: Number(request.params.id) }
            }
          },
          projects: {
            updateMany: {
              data: { finishedAt: new Date() },
              where: { propertyId: Number(request.params.id) }
            }
          }
        },
        select: propertyFindParams,
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({
        entity: { english: 'Property', portuguese: 'Propriedade' },
        error,
        response
      });
    }
  };
