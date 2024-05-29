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
  validationErrorResponse,
  whereById
} from '@main/utils';
import { updateAddressSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import type { Optional } from '@prisma/client/runtime/library';
import type { Request, Response } from 'express';

export interface InsertAddressBody {
  zipCode: string;
  state: string;
  city: string;
  municipality: string;
  street: string;
  number: number;
}

/**
 * @typedef {object} UpdateAddressBody
 * @property {string} zipCode
 * @property {string} state
 * @property {string} city
 * @property {string} municipality
 * @property {string} street
 * @property {number} number
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
 * @param {integer} id.path.required
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
        where: whereById(request.params.id)
      });

      if (address === null)
        return notFound({
          entity: {
            english: 'Address',
            portuguese: 'Endereço'
          },
          response
        });

      if (address.property?.userId !== request.user.id && request.user.role !== Role.admin)
        return forbidden({
          message: { english: 'update this address', portuguese: 'atualizar este endereço' },
          response
        });

      const { city, municipality, number, state, street, zipCode } =
        request.body as Optional<InsertAddressBody>;

      let formattedNumber: string | undefined;

      if (typeof number !== 'undefined') formattedNumber = String(number);

      const payload = await DataSource.address.update({
        data: {
          city,
          municipality,
          number: formattedNumber,
          state,
          street,
          zipCode
        },
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
