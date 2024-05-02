export const HTTP_ERRORS = {
  APP: {
    METHOD_NOT_IMPLEMENTED: 'Method not implemented',
    METHOD_NOT_ALLOWED: 'Method not allowed',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    VALIDATION_PASSPORT_CALLBACK_NOT_PROVIDED: 'Validation passport callback not provided',
    UNAUTHORIZED: 'Unauthorized',
    FILE_FUNCTIONS_HEADER_NOT_PROVIDED: 'File functions header not provided',
    PROVIDERS_HEADER_NOT_PROVIDED: 'Providers header not provided',
    TYPES_HEADER_NOT_PROVIDED: 'Types header not provided',
  },
  CONTROLLER: {
    FILE_FUNCTION_NOT_PROVIDED: 'File function not provided',
    FILE_FUNCTION_PATH_NOT_PROVIDED: 'File function path not provided',
    FILE_FUNCTION_CONSTANTS_NOT_FOUND: 'File function constants not found',
    FILE_FUNCTION_NOT_EXISTS: 'File function not exists',
    FILE_FUNCTION_PARAMS_NOT_PROVIDED: 'File function params not provided',
    FILE_FUNCTION_UNNABLE_CONVERT_BUFFER: 'File function unnable to convert file to buffer',
    FILE_FUNCTION_UNNABLE_CONVERT_FUNCTION: 'File function unnable to convert buffer to function',
    FILE_FUNCTION_RESULT_NOT_MATCH: 'File function result type not match result type',
  },
}