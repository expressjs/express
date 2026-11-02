/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

"use strict";

/**
 * Error codes for Express errors.
 *
 * These codes provide a stable contract for error handling,
 * allowing developers to rely on error codes rather than error messages.
 *
 * @public
 */

var codes = {
  // Response errors
  EXPRESS_ERR_INVALID_STATUS_CODE: "EXPRESS_ERR_INVALID_STATUS_CODE",
  EXPRESS_ERR_STATUS_CODE_OUT_OF_RANGE: "EXPRESS_ERR_STATUS_CODE_OUT_OF_RANGE",
  EXPRESS_ERR_SENDFILE_PATH_REQUIRED: "EXPRESS_ERR_SENDFILE_PATH_REQUIRED",
  EXPRESS_ERR_SENDFILE_PATH_NOT_STRING: "EXPRESS_ERR_SENDFILE_PATH_NOT_STRING",
  EXPRESS_ERR_SENDFILE_PATH_NOT_ABSOLUTE: "EXPRESS_ERR_SENDFILE_PATH_NOT_ABSOLUTE",
  EXPRESS_ERR_CONTENT_TYPE_ARRAY: "EXPRESS_ERR_CONTENT_TYPE_ARRAY",
  EXPRESS_ERR_COOKIE_SECRET_REQUIRED: "EXPRESS_ERR_COOKIE_SECRET_REQUIRED",

  // Application/middleware errors
  EXPRESS_ERR_MIDDLEWARE_REQUIRED: "EXPRESS_ERR_MIDDLEWARE_REQUIRED",
  EXPRESS_ERR_ENGINE_CALLBACK_REQUIRED: "EXPRESS_ERR_ENGINE_CALLBACK_REQUIRED",

  // Request errors
  EXPRESS_ERR_HEADER_NAME_REQUIRED: "EXPRESS_ERR_HEADER_NAME_REQUIRED",
  EXPRESS_ERR_HEADER_NAME_NOT_STRING: "EXPRESS_ERR_HEADER_NAME_NOT_STRING",

  // View errors
  EXPRESS_ERR_NO_DEFAULT_ENGINE: "EXPRESS_ERR_NO_DEFAULT_ENGINE",
  EXPRESS_ERR_VIEW_ENGINE_NOT_FOUND: "EXPRESS_ERR_VIEW_ENGINE_NOT_FOUND",

  // Configuration errors
  EXPRESS_ERR_INVALID_ETAG_OPTION: "EXPRESS_ERR_INVALID_ETAG_OPTION",
  EXPRESS_ERR_INVALID_QUERY_PARSER_OPTION: "EXPRESS_ERR_INVALID_QUERY_PARSER_OPTION",
};

/**
 * Create a TypeError with an error code.
 *
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @return {TypeError}
 * @private
 */

function createTypeError(code, message) {
  var error = new TypeError(message);
  error.code = code;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createTypeError);
  }
  return error;
}

/**
 * Create a RangeError with an error code.
 *
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @return {RangeError}
 * @private
 */

function createRangeError(code, message) {
  var error = new RangeError(message);
  error.code = code;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createRangeError);
  }
  return error;
}

/**
 * Create an Error with an error code.
 *
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @return {Error}
 * @private
 */

function createError(code, message) {
  var error = new Error(message);
  error.code = code;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createError);
  }
  return error;
}

/**
 * Check whether an error was thrown by Express.
 *
 * Returns true only for errors carrying one of the codes defined in this
 * module, so errors from other packages that happen to set a `code` are
 * not matched.
 *
 * @param {*} err
 * @return {boolean}
 * @public
 */

function isExpressError(err) {
  return err instanceof Error &&
    typeof err.code === 'string' &&
    Object.prototype.hasOwnProperty.call(codes, err.code);
}

/**
 * Module exports.
 * @public
 */

module.exports = {
  codes: Object.freeze(codes),
  createTypeError: createTypeError,
  createRangeError: createRangeError,
  createError: createError,
  isExpressError: isExpressError,
};
