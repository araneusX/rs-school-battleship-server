import { HttpCode, InternalErrorCodes, InternalErrorMessages } from '../../constants/index.js';

export class InternalError extends Error {
  code: string | number;

  constructor(error: unknown);
  constructor(error: { message: string; code: InternalErrorCodes }) {
    let message: string = InternalErrorMessages.UnknownError;
    let code: string | number = InternalErrorCodes.UnknownError;

    if (error && typeof error === 'object') {
      message = error.message ?? message;
      code = error.code ?? code;
    }

    super(message);

    this.code = code;
  }

  getHttpError() {
    if (Object.values(HttpCode).includes(this.code)) {
      return {
        message: this.message,
        code: this.code as HttpCode,
      };
    }

    if ((Object.values(InternalErrorCodes) as (string | number)[]).includes(this.code)) {
      switch (this.code) {
        case InternalErrorCodes.InvalidInputData:
          return {
            message: this.message,
            code: HttpCode.InvalidRequest,
          };
        case InternalErrorCodes.ItemNotExist:
          return {
            message: this.message,
            code: HttpCode.NotFound,
          };
        default:
          return {
            message: this.message,
            code: HttpCode.UnknownInternal,
          };
      }
    }

    return {
      message: this.message,
      code: HttpCode.UnknownInternal,
    };
  }
}
