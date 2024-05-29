import { DataSource } from '@infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  forbidden,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '@main/utils';
import { propertyFindParams } from '@data/search';
import { updatePropertySchema } from '@data/validation';
import { userIsOwnerOfProperty } from '@application/helper';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  totalArea?: number;
}

/**
 * @typedef {object} UpdatePropertyBody
 * @property {string} name
 * @property {number} totalArea
 */

/**
 * @typedef {object} UpdatePropertyResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Property} payload
 */

/**
 * PUT /property/{id}
 * @summary Update Property
 * @tags Property
 * @security BearerAuth
 * @param {UpdatePropertyBody} request.body
 * @param {integer} id.path.required
 * @return {UpdatePropertyResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updatePropertyController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updatePropertySchema.validate(request, { abortEarly: false });

      if (!(await userIsOwnerOfProperty(request)))
        return forbidden({
          message: { english: 'update this property', portuguese: 'atualizar esta propriedade' },
          response
        });

      const { name, totalArea } = request.body as Body;

      const payload = await DataSource.property.update({
        data: { name, totalArea },
        select: propertyFindParams,
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'Property', portuguese: 'Propriedade' },
        error,
        response
      });
    }
  };
