import { DataSource } from '@infra/database';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { flockFindParams } from '@data/search';
import { flockListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';
import type { flockQueryFields } from '@data/validation';

/**
 * @typedef {object} FindFlockPayload
 * @property {array<Flock>} content
 * @property {integer} totalElements
 * @property {integer} totalPages
 */

/**
 * @typedef {object} FindFlockResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindFlockPayload} payload
 */

/**
 * GET /flock
 * @summary Find Flocks
 * @tags Flock
 * @security BearerAuth
 * @param {string} name.query
 * @param {number} propertyId.query
 * @param {number} totalCalvesGreaterThan.query
 * @param {number} totalCalvesLessThan.query
 * @param {number} totalCowsGreaterThan.query
 * @param {number} totalCowsLessThan.query
 * @param {number} totalHeifersGreaterThan.query
 * @param {number} totalHeifersLessThan.query
 * @param {number} totalOthersGreaterThan.query
 * @param {number} totalOthersLessThan.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,propertyId,totalCalves,totalCows,totalHeifers,totalOthers,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindFlockResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findFlockController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<flockQueryFields>({
        list: flockListQueryFields,
        query
      });

      const search = await DataSource.flock.findMany({
        orderBy,
        select: flockFindParams({ findProperty: typeof query.propertyId === 'undefined' }),
        skip,
        take,
        where
      });

      const totalElements = await DataSource.flock.count({
        where
      });

      return ok({
        payload: {
          content: search,
          totalElements,
          totalPages: Math.ceil(totalElements / take)
        },
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
