/* eslint-disable sort-keys-fix/sort-keys-fix */
import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import { ValidationError } from 'yup';
import {
  errorLogger,
  forbidden,
  messageErrorResponse,
  notFound,
  ok,
  validationErrorResponse
} from '@main/utils';
import { flockFindParams } from '@data/search';
import { hasUserById, userIsOwnerOfProperty } from '@application/helper';
import { insertFlockSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  totalCalves: number;
  totalCows: number;
  totalHeifers: number;
  totalOthers: number;
  propertyId: number;
  userId?: number;
}

/**
 * @typedef {object} InsertFlockBody
 * @property {string} name.required
 * @property {number} totalCalves.required
 * @property {number} totalCows.required
 * @property {number} totalHeifers.required
 * @property {number} totalOthers.required
 * @property {number} propertyId.required
 * @property {number} userId
 */

/**
 * @typedef {object} InsertFlockResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Flock} payload
 */

/**
 * POST /flock
 * @summary Insert Flock
 * @tags Flock
 * @security BearerAuth
 * @param {InsertFlockBody} request.body.required
 * @return {InsertFlockResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertFlockController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertFlockSchema.validate(request, { abortEarly: false });

      const { name, totalCalves, totalCows, totalHeifers, totalOthers, propertyId, userId } =
        request.body as Body;

      if (
        !(await userIsOwnerOfProperty(request, propertyId)) ||
        (typeof userId !== 'undefined' &&
          request.user.role !== Role.admin &&
          request.user.id !== userId)
      )
        return forbidden({
          message: {
            english: 'register a flock in another property or to another user',
            portuguese: 'cadastrar um rebanho em outra propriedade ou para outro usuário'
          },
          response
        });

      if (typeof userId !== 'undefined' && !(await hasUserById(userId)))
        return notFound({ entity: { english: 'User', portuguese: 'Usuário' }, response });

      await DataSource.flock.updateMany({
        data: { finishedAt: new Date() },
        where: { AND: { finishedAt: null, propertyId } }
      });

      const payload = await DataSource.flock.create({
        data: {
          name,
          totalCalves,
          totalCows,
          totalHeifers,
          totalOthers,
          propertyId,
          userId: userId ?? request.user.id
        },
        select: flockFindParams({ findProperty: true })
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
