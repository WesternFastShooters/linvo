import { LinvoError, ErrorCode } from '@linvo/global/exceptions';

export class SchemaValidateError extends LinvoError {
  constructor(flavour: string, message: string) {
    super(
      ErrorCode.SchemaValidateError,
      `Invalid schema for ${flavour}: ${message}`
    );
  }
}
