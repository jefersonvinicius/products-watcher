import { ProductNotFound } from '@app/core/entities/product';
import { HttpStatusCode } from '@app/infra/http/status-codes';

export class HttpError extends Error {
  constructor(readonly message: string, readonly statusCode: number) {
    super(message);
  }

  static fromError(error: any) {
    if (error instanceof HttpError) return error;
    if (error instanceof ProductNotFound) return new HttpError(error.message, HttpStatusCode.NotFound);
    return new HttpError(error.message ?? 'Unexpected Error', HttpStatusCode.ServerError);
  }
}
