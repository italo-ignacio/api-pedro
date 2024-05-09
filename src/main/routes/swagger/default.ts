/**
 * @typedef {object} Messages
 * @property {string} english
 * @property {string} portuguese
 */

/**
 * @typedef {object} Errors
 * @property {Messages} message
 * @property {string} param
 */

/**
 * @typedef {object} BadRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */

/**
 * @typedef {object} UnauthorizedRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */

/**
 * @typedef {object} NotFoundRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */

/**
 * @typedef {object} ForbiddenRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */
