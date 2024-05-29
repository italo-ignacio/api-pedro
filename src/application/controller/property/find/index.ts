import { DataSource } from '@infra/database';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import { propertyFindParams } from '@data/search';
import { propertyListQueryFields } from '@data/validation';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';
import type { propertyQueryFields } from '@data/validation';

/**
 * @typedef {object} FindPropertyPayload
 * @property {array<Property>} content
 * @property {integer} totalElements
 * @property {integer} totalPages
 */

/**
 * @typedef {object} FindPropertyResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindPropertyPayload} payload
 */

/**
 * GET /property
 * @summary Find Properties
 * @tags Property
 * @security BearerAuth
 * @param {string} name.query
 * @param {number} totalAreaGreaterThan.query
 * @param {number} totalAreaLessThan.query
 * @param {integer} userId.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,totalArea,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindPropertyResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findPropertyController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<propertyQueryFields>({
        list: propertyListQueryFields,
        query
      });

      const search = await DataSource.property.findMany({
        orderBy,
        select: propertyFindParams,
        skip,
        take,
        where
      });

      const totalElements = await DataSource.property.count({
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
