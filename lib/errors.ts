export interface AppError {
  code: string;
  message: string;
  httpStatus: number;
}

export const ERROR_CODES = {
  EMPTY_URL: {
    code: "EMPTY_URL",
    message: "URL cannot be empty.",
    httpStatus: 400,
  },
  INVALID_URL: {
    code: "INVALID_URL",
    message: "Please enter a valid URL.",
    httpStatus: 400,
  },
  UNSUPPORTED_PROTOCOL: {
    code: "UNSUPPORTED_PROTOCOL",
    message: "Only HTTP and HTTPS protocols are supported.",
    httpStatus: 400,
  },
  DNS_FAILURE: {
    code: "DNS_FAILURE",
    message: "Unable to resolve the domain name. Please check the URL.",
    httpStatus: 502,
  },
  CONNECTION_REFUSED: {
    code: "CONNECTION_REFUSED",
    message: "Unable to connect to the target website.",
    httpStatus: 502,
  },
  NETWORK_FAILURE: {
    code: "NETWORK_FAILURE",
    message: "Unable to connect to the target website.",
    httpStatus: 502,
  },
  SSL_ERROR: {
    code: "SSL_ERROR",
    message: "SSL certificate verification failed for the target website.",
    httpStatus: 502,
  },
  REQUEST_TIMEOUT: {
    code: "REQUEST_TIMEOUT",
    message: "The request timed out while connecting to the website.",
    httpStatus: 504,
  },
  TOO_MANY_REDIRECTS: {
    code: "TOO_MANY_REDIRECTS",
    message: "The website resulted in too many redirects.",
    httpStatus: 502,
  },
  NON_HTML_CONTENT: {
    code: "NON_HTML_CONTENT",
    message: "The provided URL does not point to an HTML webpage.",
    httpStatus: 415,
  },
  HTTP_404: {
    code: "HTTP_404",
    message: "The requested page could not be found.",
    httpStatus: 400,
  },
  HTTP_500: {
    code: "HTTP_500",
    message: "The target server encountered an internal server error.",
    httpStatus: 502,
  },
  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "An internal server error occurred while processing the request.",
    httpStatus: 500,
  },
} as const;

export function createErrorResponse(appError: AppError) {
  return {
    success: false as const,
    error: {
      code: appError.code,
      message: appError.message,
    },
    httpStatus: appError.httpStatus,
  };
}
