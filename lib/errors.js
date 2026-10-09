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
  ERR_INVALID_STATUS_CODE: "ERR_INVALID_STATUS_CODE",
  ERR_STATUS_CODE_OUT_OF_RANGE: "ERR_STATUS_CODE_OUT_OF_RANGE",
  ERR_SENDFILE_PATH_REQUIRED: "ERR_SENDFILE_PATH_REQUIRED",
  ERR_SENDFILE_PATH_NOT_STRING: "ERR_SENDFILE_PATH_NOT_STRING",
  ERR_SENDFILE_PATH_NOT_ABSOLUTE: "ERR_SENDFILE_PATH_NOT_ABSOLUTE",
  ERR_CONTENT_TYPE_ARRAY: "ERR_CONTENT_TYPE_ARRAY",
  ERR_COOKIE_SECRET_REQUIRED: "ERR_COOKIE_SECRET_REQUIRED",

  // Application/middleware errors
  ERR_MIDDLEWARE_REQUIRED: "ERR_MIDDLEWARE_REQUIRED",
  ERR_ENGINE_CALLBACK_REQUIRED: "ERR_ENGINE_CALLBACK_REQUIRED",

  // Request errors
  ERR_HEADER_NAME_REQUIRED: "ERR_HEADER_NAME_REQUIRED",
  ERR_HEADER_NAME_NOT_STRING: "ERR_HEADER_NAME_NOT_STRING",

  // View errors
  ERR_NO_DEFAULT_ENGINE: "ERR_NO_DEFAULT_ENGINE",
  ERR_VIEW_ENGINE_NOT_FOUND: "ERR_VIEW_ENGINE_NOT_FOUND",

  // Configuration errors
  ERR_INVALID_ETAG_OPTION: "ERR_INVALID_ETAG_OPTION",
  ERR_INVALID_QUERY_PARSER_OPTION: "ERR_INVALID_QUERY_PARSER_OPTION",
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
 * Module exports.
 * @public
 */

module.exports = {
  codes: Object.freeze(codes),
  createTypeError: createTypeError,
  createRangeError: createRangeError,
  createError: createError,
};
