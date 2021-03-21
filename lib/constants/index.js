module.exports = {
  ENVS: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
  },
  TYPES: {
    FUNCTION: 'function',
    STRING: 'string',
    NUMBER: 'number',
    OBJECT: 'object',
    BOOLEAN: 'boolean',
  },
  PROTOCOLS: {
    HTTP: "http",
    HTTPS: "https"
  },
  METHODS: {
    LOWERCASE: {
      GET: 'get',
      HEAD: 'head',
    },
    UPPERCASE: {
      GET: 'GET',
      HEAD: 'HEAD',
      OPTIONS: 'OPTIONS',
    }
  },
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MULTIPLE_CHOICES: 300,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    NOT_ACCEPTABLE: 406,
  },
  CODES: {
    ECONNRESET: "ECONNRESET",
    ECONNABORTED: "ECONNABORTED",
    EISDIR: "EISDIR"
  }
};
