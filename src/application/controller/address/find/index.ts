import { DataSource } from '@infra/database';
import { addressFindParams } from '@data/search';
import { addressListQueryFields } from '@data/validation';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '@main/utils';
import type { Controller } from '@domain/protocols';
import type { Request, Response } from 'express';
import type { addressQueryFields } from '@data/validation';

/**
 * @typedef {object} FindAddressPayload
 * @property {array<Address>} content
 * @property {integer} totalElements
 * @property {integer} totalPages
 */

/**
 * @typedef {object} FindAddressResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindAddressPayload} payload
 */

/**
 * GET /address
 * @summary Find Address
 * @tags Address
 * @security BearerAuth
 * @param {string} city.query
 * @param {string} municipality.query
 * @param {string} number.query
 * @param {string} state.query
 * @param {string} street.query
 * @param {string} zipCode.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:city,municipality,number,state,street,zipCode,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindAddressResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findAddressController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<addressQueryFields>({
        list: addressListQueryFields,
        query
      });

      const search = await DataSource.address.findMany({
        orderBy,
        select: addressFindParams,
        skip,
        take,
        where
      });

      const totalElements = await DataSource.address.count({
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
