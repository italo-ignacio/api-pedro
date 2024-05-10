import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import { ValidationError } from 'yup';
import { addressFindParams } from '@data/search';
import {
  errorLogger,
  forbidden,
  messageErrorResponse,
  notFound,
  ok,
  validationErrorResponse
} from '@main/utils';
import { updateAddressSchema } from '@data/validation';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  zipCode?: string;
  state?: string;
  city?: string;
  municipality?: string;
  street?: string;
  number?: string;
}

/**
 * @typedef {object} UpdateAddressBody
 * @property {string} zipCode
 * @property {string} state
 * @property {string} city
 * @property {string} municipality
 * @property {string} street
 * @property {string} number
 */

/**
 * @typedef {object} UpdateAddressResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Address} payload
 */

/**
 * PUT /address/{id}
 * @summary Update Address
 * @tags Address
 * @security BearerAuth
 * @param {UpdateAddressBody} request.body
 * @param {string} id.path.required
 * @return {UpdateAddressResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateAddressController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updateAddressSchema.validate(request, { abortEarly: false });

      const address = await DataSource.address.findUnique({
        select: {
          property: {
            select: {
              userId: true
            }
          }
        },
        where: { id: Number(request.params.id) }
      });

      if (address === null)
        return notFound({
          entity: {
            english: 'Address',
            portuguese: 'Endereço'
          },
          response
        });

      if (address.property?.userId !== request.user.id || request.user.role !== Role.admin)
        return forbidden({
          message: { english: 'update this address', portuguese: 'atualizar este endereço' },
          response
        });

      const { city, municipality, number, state, street, zipCode } = request.body as Body;

      const payload = await DataSource.address.update({
        data: { city, municipality, number, state, street, zipCode },
        select: addressFindParams,
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
