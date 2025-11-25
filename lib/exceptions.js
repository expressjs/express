/**
 * httpExceptions.js
 * Enhanced HTTP exceptions with additional error types and features
 */

class HttpException extends Error {
  constructor(
    statusCode = 500,
    message = "Internal Server Error",
    details = null,
    errorCode = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
        errorCode: this.errorCode,
        timestamp: this.timestamp,
      },
    };
  }

  toString() {
    return `${this.name} [${this.statusCode}]: ${this.message}`;
  }
}

/* 1xx Informational */
class Continue extends HttpException {
  constructor(msg = "Continue") {
    super(100, msg);
  }
}
class SwitchingProtocols extends HttpException {
  constructor(msg = "Switching Protocols") {
    super(101, msg);
  }
}
class Processing extends HttpException {
  constructor(msg = "Processing") {
    super(102, msg);
  }
}
class EarlyHints extends HttpException {
  constructor(msg = "Early Hints") {
    super(103, msg);
  }
}

/* 2xx Success */
class OK extends HttpException {
  constructor(msg = "OK") {
    super(200, msg);
  }
}
class Created extends HttpException {
  constructor(msg = "Created") {
    super(201, msg);
  }
}
class Accepted extends HttpException {
  constructor(msg = "Accepted") {
    super(202, msg);
  }
}
class NonAuthoritativeInformation extends HttpException {
  constructor(msg = "Non-Authoritative Information") {
    super(203, msg);
  }
}
class NoContent extends HttpException {
  constructor(msg = "No Content") {
    super(204, msg);
  }
}
class ResetContent extends HttpException {
  constructor(msg = "Reset Content") {
    super(205, msg);
  }
}
class PartialContent extends HttpException {
  constructor(msg = "Partial Content") {
    super(206, msg);
  }
}
class MultiStatus extends HttpException {
  constructor(msg = "Multi-Status") {
    super(207, msg);
  }
}
class AlreadyReported extends HttpException {
  constructor(msg = "Already Reported") {
    super(208, msg);
  }
}
class IMUsed extends HttpException {
  constructor(msg = "IM Used") {
    super(226, msg);
  }
}

/* 3xx Redirection */
class MultipleChoices extends HttpException {
  constructor(msg = "Multiple Choices") {
    super(300, msg);
  }
}
class MovedPermanently extends HttpException {
  constructor(msg = "Moved Permanently") {
    super(301, msg);
  }
}
class Found extends HttpException {
  constructor(msg = "Found") {
    super(302, msg);
  }
}
class SeeOther extends HttpException {
  constructor(msg = "See Other") {
    super(303, msg);
  }
}
class NotModified extends HttpException {
  constructor(msg = "Not Modified") {
    super(304, msg);
  }
}
class UseProxy extends HttpException {
  constructor(msg = "Use Proxy") {
    super(305, msg);
  }
}
class TemporaryRedirect extends HttpException {
  constructor(msg = "Temporary Redirect") {
    super(307, msg);
  }
}
class PermanentRedirect extends HttpException {
  constructor(msg = "Permanent Redirect") {
    super(308, msg);
  }
}

/* 4xx Client Errors */
class BadRequest extends HttpException {
  constructor(msg = "Bad Request", details = null) {
    super(400, msg, details);
  }
}
class Unauthorized extends HttpException {
  constructor(msg = "Unauthorized", details = null) {
    super(401, msg, details);
  }
}
class PaymentRequired extends HttpException {
  constructor(msg = "Payment Required") {
    super(402, msg);
  }
}
class Forbidden extends HttpException {
  constructor(msg = "Forbidden", details = null) {
    super(403, msg, details);
  }
}
class NotFound extends HttpException {
  constructor(msg = "Not Found", details = null) {
    super(404, msg, details);
  }
}
class MethodNotAllowed extends HttpException {
  constructor(msg = "Method Not Allowed", allowedMethods = []) {
    super(405, msg, { allowed: allowedMethods });
  }
}
class NotAcceptable extends HttpException {
  constructor(msg = "Not Acceptable") {
    super(406, msg);
  }
}
class ProxyAuthenticationRequired extends HttpException {
  constructor(msg = "Proxy Authentication Required") {
    super(407, msg);
  }
}
class RequestTimeout extends HttpException {
  constructor(msg = "Request Timeout") {
    super(408, msg);
  }
}
class Conflict extends HttpException {
  constructor(msg = "Conflict", details = null) {
    super(409, msg, details);
  }
}
class Gone extends HttpException {
  constructor(msg = "Gone") {
    super(410, msg);
  }
}
class LengthRequired extends HttpException {
  constructor(msg = "Length Required") {
    super(411, msg);
  }
}
class PreconditionFailed extends HttpException {
  constructor(msg = "Precondition Failed") {
    super(412, msg);
  }
}
class PayloadTooLarge extends HttpException {
  constructor(msg = "Payload Too Large", maxSize = null) {
    super(413, msg, maxSize ? { maxSize } : null);
  }
}
class URITooLong extends HttpException {
  constructor(msg = "URI Too Long") {
    super(414, msg);
  }
}
class UnsupportedMediaType extends HttpException {
  constructor(msg = "Unsupported Media Type") {
    super(415, msg);
  }
}
class RangeNotSatisfiable extends HttpException {
  constructor(msg = "Range Not Satisfiable") {
    super(416, msg);
  }
}
class ExpectationFailed extends HttpException {
  constructor(msg = "Expectation Failed") {
    super(417, msg);
  }
}
class ImATeapot extends HttpException {
  constructor(msg = "I'm a teapot") {
    super(418, msg);
  }
}
class MisdirectedRequest extends HttpException {
  constructor(msg = "Misdirected Request") {
    super(421, msg);
  }
}
class UnprocessableEntity extends HttpException {
  constructor(msg = "Unprocessable Entity", errors = null) {
    super(422, msg, errors);
  }
}
class Locked extends HttpException {
  constructor(msg = "Locked") {
    super(423, msg);
  }
}
class FailedDependency extends HttpException {
  constructor(msg = "Failed Dependency") {
    super(424, msg);
  }
}
class TooEarly extends HttpException {
  constructor(msg = "Too Early") {
    super(425, msg);
  }
}
class UpgradeRequired extends HttpException {
  constructor(msg = "Upgrade Required") {
    super(426, msg);
  }
}
class PreconditionRequired extends HttpException {
  constructor(msg = "Precondition Required") {
    super(428, msg);
  }
}
class TooManyRequests extends HttpException {
  constructor(msg = "Too Many Requests", retryAfter = null) {
    super(429, msg, retryAfter ? { retryAfter } : null);
  }
}
class RequestHeaderFieldsTooLarge extends HttpException {
  constructor(msg = "Request Header Fields Too Large") {
    super(431, msg);
  }
}
class UnavailableForLegalReasons extends HttpException {
  constructor(msg = "Unavailable For Legal Reasons") {
    super(451, msg);
  }
}

/* 5xx Server Errors */
class InternalServerError extends HttpException {
  constructor(msg = "Internal Server Error", details = null) {
    super(500, msg, details);
  }
}
class NotImplemented extends HttpException {
  constructor(msg = "Not Implemented") {
    super(501, msg);
  }
}
class BadGateway extends HttpException {
  constructor(msg = "Bad Gateway") {
    super(502, msg);
  }
}
class ServiceUnavailable extends HttpException {
  constructor(msg = "Service Unavailable", retryAfter = null) {
    super(503, msg, retryAfter ? { retryAfter } : null);
  }
}
class GatewayTimeout extends HttpException {
  constructor(msg = "Gateway Timeout") {
    super(504, msg);
  }
}
class HTTPVersionNotSupported extends HttpException {
  constructor(msg = "HTTP Version Not Supported") {
    super(505, msg);
  }
}
class VariantAlsoNegotiates extends HttpException {
  constructor(msg = "Variant Also Negotiates") {
    super(506, msg);
  }
}
class InsufficientStorage extends HttpException {
  constructor(msg = "Insufficient Storage") {
    super(507, msg);
  }
}
class LoopDetected extends HttpException {
  constructor(msg = "Loop Detected") {
    super(508, msg);
  }
}
class NotExtended extends HttpException {
  constructor(msg = "Not Extended") {
    super(510, msg);
  }
}
class NetworkAuthenticationRequired extends HttpException {
  constructor(msg = "Network Authentication Required") {
    super(511, msg);
  }
}

/* Additional Custom Exceptions */
class ValidationError extends BadRequest {
  constructor(errors, msg = "Validation Failed") {
    super(msg, { errors });
    this.errorCode = "VALIDATION_ERROR";
  }
}

class AuthenticationError extends Unauthorized {
  constructor(msg = "Authentication Required", details = null) {
    super(msg, details);
    this.errorCode = "AUTH_REQUIRED";
  }
}

class AuthorizationError extends Forbidden {
  constructor(msg = "Insufficient Permissions", details = null) {
    super(msg, details);
    this.errorCode = "INSUFFICIENT_PERMISSIONS";
  }
}

class RateLimitExceeded extends TooManyRequests {
  constructor(retryAfter = null, msg = "Rate Limit Exceeded") {
    super(msg, retryAfter);
    this.errorCode = "RATE_LIMIT_EXCEEDED";
  }
}

class DatabaseError extends InternalServerError {
  constructor(details = null, msg = "Database Error") {
    super(msg, details);
    this.errorCode = "DATABASE_ERROR";
  }
}

class ExternalServiceError extends BadGateway {
  constructor(serviceName = null, msg = "External Service Error") {
    super(msg, serviceName ? { service: serviceName } : null);
    this.errorCode = "EXTERNAL_SERVICE_ERROR";
  }
}

class ResourceExhausted extends InsufficientStorage {
  constructor(resource = null, msg = "Resource Exhausted") {
    super(msg, resource ? { resource } : null);
    this.errorCode = "RESOURCE_EXHAUSTED";
  }
}

class MaintenanceMode extends ServiceUnavailable {
  constructor(estimatedRestoration = null, msg = "Service Under Maintenance") {
    super(msg, estimatedRestoration ? { estimatedRestoration } : null);
    this.errorCode = "MAINTENANCE_MODE";
  }
}

/* Utility Functions */
const HttpExceptions = {
  // Original HTTP exceptions
  HttpException,
  // 1xx
  Continue,
  SwitchingProtocols,
  Processing,
  EarlyHints,
  // 2xx
  OK,
  Created,
  Accepted,
  NonAuthoritativeInformation,
  NoContent,
  ResetContent,
  PartialContent,
  MultiStatus,
  AlreadyReported,
  IMUsed,
  // 3xx
  MultipleChoices,
  MovedPermanently,
  Found,
  SeeOther,
  NotModified,
  UseProxy,
  TemporaryRedirect,
  PermanentRedirect,
  // 4xx
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  ProxyAuthenticationRequired,
  RequestTimeout,
  Conflict,
  Gone,
  LengthRequired,
  PreconditionFailed,
  PayloadTooLarge,
  URITooLong,
  UnsupportedMediaType,
  RangeNotSatisfiable,
  ExpectationFailed,
  ImATeapot,
  MisdirectedRequest,
  UnprocessableEntity,
  Locked,
  FailedDependency,
  TooEarly,
  UpgradeRequired,
  PreconditionRequired,
  TooManyRequests,
  RequestHeaderFieldsTooLarge,
  UnavailableForLegalReasons,
  // 5xx
  InternalServerError,
  NotImplemented,
  BadGateway,
  ServiceUnavailable,
  GatewayTimeout,
  HTTPVersionNotSupported,
  VariantAlsoNegotiates,
  InsufficientStorage,
  LoopDetected,
  NotExtended,
  NetworkAuthenticationRequired,
  // Custom exceptions
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  RateLimitExceeded,
  DatabaseError,
  ExternalServiceError,
  ResourceExhausted,
  MaintenanceMode,

  /* Utility Methods */
  createFromStatusCode(statusCode, message = null, details = null) {
    const exceptionMap = {
      // 1xx
      100: Continue,
      101: SwitchingProtocols,
      102: Processing,
      103: EarlyHints,
      // 2xx
      200: OK,
      201: Created,
      202: Accepted,
      203: NonAuthoritativeInformation,
      204: NoContent,
      205: ResetContent,
      206: PartialContent,
      207: MultiStatus,
      208: AlreadyReported,
      226: IMUsed,
      // 3xx
      300: MultipleChoices,
      301: MovedPermanently,
      302: Found,
      303: SeeOther,
      304: NotModified,
      305: UseProxy,
      307: TemporaryRedirect,
      308: PermanentRedirect,
      // 4xx
      400: BadRequest,
      401: Unauthorized,
      402: PaymentRequired,
      403: Forbidden,
      404: NotFound,
      405: MethodNotAllowed,
      406: NotAcceptable,
      407: ProxyAuthenticationRequired,
      408: RequestTimeout,
      409: Conflict,
      410: Gone,
      411: LengthRequired,
      412: PreconditionFailed,
      413: PayloadTooLarge,
      414: URITooLong,
      415: UnsupportedMediaType,
      416: RangeNotSatisfiable,
      417: ExpectationFailed,
      418: ImATeapot,
      421: MisdirectedRequest,
      422: UnprocessableEntity,
      423: Locked,
      424: FailedDependency,
      425: TooEarly,
      426: UpgradeRequired,
      428: PreconditionRequired,
      429: TooManyRequests,
      431: RequestHeaderFieldsTooLarge,
      451: UnavailableForLegalReasons,
      // 5xx
      500: InternalServerError,
      501: NotImplemented,
      502: BadGateway,
      503: ServiceUnavailable,
      504: GatewayTimeout,
      505: HTTPVersionNotSupported,
      506: VariantAlsoNegotiates,
      507: InsufficientStorage,
      508: LoopDetected,
      510: NotExtended,
      511: NetworkAuthenticationRequired,
    };

    const ExceptionClass = exceptionMap[statusCode] || InternalServerError;
    return new ExceptionClass(message, details);
  },

  isClientError(statusCode) {
    return statusCode >= 400 && statusCode < 500;
  },

  isServerError(statusCode) {
    return statusCode >= 500 && statusCode < 600;
  },

  isError(statusCode) {
    return statusCode >= 400;
  },
};

const ErrorHandler = () => {
  return (err, req, res, next) => {
    if (err instanceof HttpException) {
      return res.status(err.statusCode).json(err.toJSON());
    }

    // Handle non-HttpException errors
    const unexpectedError = new InternalServerError(
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
      process.env.NODE_ENV === "development" ? { stack: err.stack } : null
    );

    return res.status(500).json(unexpectedError.toJSON());
  };
};

module.exports = HttpExceptions;
module.exports.ErrorHandler = ErrorHandler;
