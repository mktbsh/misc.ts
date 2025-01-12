type ErrorType = string & {};

type HttpStatusCode = 400 | 401;

export const ERROR_RESPONSE_CONTENT_TYPE = "application/problem+json";

interface RFC7807Error {
  title: string;
  detail?: string;
  type?: ErrorType;
  status?: HttpStatusCode;
}

export interface ErrorResponse extends RFC7807Error {
  error_code?: string;
}

export interface BadRequestError extends ErrorResponse {
  invalid_params: ReadonlyArray<{
    name: string;
    reason: string;
  }>;
}

export interface UnauthorizedError extends ErrorResponse {
  authentication_url?: string;
}

export interface ForbiddenError extends ErrorResponse {
  privilege_escalation_url?: string;
}
