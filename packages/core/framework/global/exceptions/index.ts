import { ErrorCode } from './code';

export class LinvoError extends Error {
  static ErrorCode = ErrorCode;

  code: ErrorCode;

  isFatal: boolean;

  constructor(code: ErrorCode, message: string, options?: { cause: Error }) {
    super(message, options);
    this.name = 'LinvoError';
    this.code = code;
    this.isFatal = code >= 10000;
  }
}

export function handleError(error: Error) {
  if (!(error instanceof LinvoError)) {
    throw error;
  }

  if (error.isFatal) {
    throw new Error(
      'A fatal error occurred in Linvo. Contact the team if you can reproduce it.',
      { cause: error }
    );
  }

  console.error(
    "A runtime error occurred in Linvo. You can ignore it if it doesn't affect the user experience."
  );
  console.error(error.stack);
}

export * from './code';
