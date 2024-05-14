/* eslint-disable sort-keys-fix/sort-keys-fix */
import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import { ValidationError } from 'yup';
import { addressFindParams, userFindParams } from '@data/search';
import {
  errorLogger,
  forbidden,
  messageErrorResponse,
  notFound,
  ok,
  validationErrorResponse
} from '@main/utils';
import { hasUserById } from '@application/helper';
import { insertPropertySchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import type { InsertAddressBody } from '@application/controller/address';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  totalArea: number;
  address: InsertAddressBody;
  userId?: number;
}

/**
 * @typedef {object} InsertAddressBody
 * @property {string} zipCode.required
 * @property {string} state.required
 * @property {string} city.required
 * @property {string} municipality.required
 * @property {string} street.required
 * @property {number} number.required
 */

/**
 * @typedef {object} InsertPropertyBody
 * @property {string} name.required
 * @property {number} totalArea.required
 * @property {InsertAddressBody} address.required
 * @property {number} userId
 */

/**
 * @typedef {object} InsertPropertyResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Property} payload
 */

/**
 * POST /property
 * @summary Insert Property
 * @tags Property
 * @security BearerAuth
 * @param {InsertPropertyBody} request.body.required
 * @return {InsertPropertyResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertPropertyController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertPropertySchema.validate(request, { abortEarly: false });

      const { totalArea, name, address, userId } = request.body as Body;

      if (
        typeof userId !== 'undefined' &&
        request.user.role !== Role.admin &&
        request.user.id !== userId
      )
        return forbidden({
          message: {
            english: 'register a property to another user',
            portuguese: 'cadastrar uma propriedade para outro usuário'
          },
          response
        });

      if (typeof userId !== 'undefined' && !(await hasUserById(userId)))
        return notFound({ entity: { english: 'User', portuguese: 'Usuário' }, response });

      const payload = await DataSource.address.create({
        data: {
          ...address,
          property: {
            create: {
              name,
              totalArea,
              userId: userId ?? request.user.id
            }
          },
          number: String(address.number),
          zipCode: address.zipCode.replace(/\D/gu, '')
        },
        select: {
          ...addressFindParams,
          property: {
            select: {
              createdAt: true,
              finishedAt: true,
              id: true,
              name: true,
              totalArea: true,
              updatedAt: true,
              user: {
                select: userFindParams
              },
              userId: true
            }
          }
        }
      });

      const formattedPayload = {
        id: payload.property?.id,
        name: payload.property?.name,
        totalArea: payload.property?.totalArea,
        address: {
          city: payload.city,
          createdAt: payload.createdAt,
          finishedAt: payload.finishedAt,
          id: payload.id,
          municipality: payload.municipality,
          number: payload.number,
          state: payload.state,
          street: payload.street,
          updatedAt: payload.updatedAt,
          zipCode: payload.zipCode
        },
        addressId: payload.id,
        user: payload.property?.user,
        userId: payload.property?.userId,
        finishedAt: payload.property?.finishedAt,
        createdAt: payload.property?.createdAt,
        updatedAt: payload.property?.updatedAt
      };

      return ok({ payload: formattedPayload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
