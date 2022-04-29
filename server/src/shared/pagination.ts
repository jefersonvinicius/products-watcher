import { Request } from 'express';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const PER_PAGE_LIMIT = 15;

export class Pagination {
  private constructor(readonly page: number, readonly perPage: number) {}

  static make(params: { page: number; perPage: number }) {
    return new Pagination(params.page, params.perPage);
  }

  static fromExpressRequest(request: Request) {
    if (!request.query) return new Pagination(DEFAULT_PAGE, DEFAULT_PER_PAGE);

    const { page, per_page } = request.query;

    const nPage = Number(page);
    const nPerPage = Number(per_page);
    return new Pagination(
      isNaN(nPage) ? DEFAULT_PAGE : nPage,
      isNaN(nPerPage) ? DEFAULT_PER_PAGE : Math.min(nPerPage, PER_PAGE_LIMIT)
    );
  }

  totalPages(params: { amount: number }) {
    return Math.ceil(params.amount / this.perPage);
  }

  toTypeORM() {
    return {
      take: this.perPage,
      skip: (this.page - 1) * this.perPage,
    };
  }
}
