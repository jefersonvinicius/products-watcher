import { Request } from 'express';

export class Pagination {
  private constructor(readonly page: number, readonly perPage: number) {}

  static make(params: { page: number; perPage: number }) {
    return new Pagination(params.page, params.perPage);
  }

  static fromExpressRequest(request: Request) {}

  toTypeORM() {}
}
