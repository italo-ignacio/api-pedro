import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import { ValidationError } from 'yup';
import {
  errorLogger,
  forbidden,
  messageErrorResponse,
  notFound,
  ok,
  validationErrorResponse,
  whereById
} from '@main/utils';
import { flockFindParams } from '@data/search';
import { updateFlockSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  totalCalves?: number;
  totalCows?: number;
  totalHeifers?: number;
  totalOthers?: number;
}

/**
 * @typedef {object} UpdateFlockBody
 * @property {string} name
 * @property {number} totalCalves
 * @property {number} totalCows
 * @property {number} totalHeifers
 * @property {number} totalOthers
 */

/**
 * @typedef {object} UpdateFlockResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Flock} payload
 */

/**
 * PUT /flock/{id}
 * @summary Update Flock
 * @tags Flock
 * @security BearerAuth
 * @param {UpdateFlockBody} request.body
 * @param {integer} id.path.required
 * @return {UpdateFlockResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateFlockController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updateFlockSchema.validate(request, { abortEarly: false });

      const flock = await DataSource.flock.findFirst({
        select: {
          id: true,
          name: true,
          propertyId: true,
          totalCalves: true,
          totalCows: true,
          totalHeifers: true,
          totalOthers: true,
          userId: true
        },
        where: whereById(request.params.id)
      });

      if (flock === null)
        return notFound({
          entity: { english: 'Flock', portuguese: 'Rebanho' },
          response
        });

      if (request.user.role !== Role.admin && flock.userId !== request.user.id)
        return forbidden({
          message: { english: 'update this flock', portuguese: 'atualizar este rebanho' },
          response
        });

      const project = await DataSource.project.findFirst({
        select: { id: true },
        where: {
          flockId: flock.id
        }
      });

      const { name, totalCalves, totalCows, totalHeifers, totalOthers } = request.body as Body;

      // Case has a project create a new flock
      if (project !== null) {
        await DataSource.flock.update({
          data: { finishedAt: new Date() },
          select: { id: true },
          where: { id: Number(request.params.id) }
        });

        const payload = await DataSource.flock.create({
          data: {
            name: name ?? flock.name,
            propertyId: flock.propertyId,
            totalCalves: totalCalves ?? flock.totalCalves,
            totalCows: totalCows ?? flock.totalCows,
            totalHeifers: totalHeifers ?? flock.totalHeifers,
            totalOthers: totalOthers ?? flock.totalOthers,
            userId: flock.userId
          },
          select: flockFindParams({ findProperty: true })
        });

        return ok({ payload, response });
      }

      const payload = await DataSource.flock.update({
        data: { name, totalCalves, totalCows, totalHeifers, totalOthers },
        select: flockFindParams({ findProperty: true }),
        where: whereById(request.params.id)
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
