import { Pagination } from '@app/shared/pagination';
import { Request } from 'express';

describe('Pagination', () => {
  describe('when creating from express request', () => {
    it('should return default values when query params are not provided', () => {
      const request = {} as Request;
      const pagination = Pagination.fromExpressRequest(request);

      expect(pagination.page).toBe(1);
      expect(pagination.perPage).toBe(10);
    });

    it('should parse from query params', () => {
      const request = { query: { page: '2', per_page: '14' } };
      const pagination = Pagination.fromExpressRequest(request as any);

      expect(pagination.page).toBe(2);
      expect(pagination.perPage).toBe(14);
    });

    it('should use default values if not number is provided', () => {
      const request = { query: { page: 'asdd', per_page: 'a' } };
      const pagination = Pagination.fromExpressRequest(request as any);

      expect(pagination.page).toBe(1);
      expect(pagination.perPage).toBe(10);
    });

    it('should use default per page value if limit is exceeded', () => {
      const request = { query: { page: '1000', per_page: '100000' } };
      const pagination = Pagination.fromExpressRequest(request as any);

      expect(pagination.page).toBe(1000);
      expect(pagination.perPage).toBe(15);
    });
  });

  describe('when calculate total pages', () => {
    it('should calculate correctly', async () => {
      const result = Pagination.make({ page: 10, perPage: 20 }).totalPages({ amount: 131 });

      expect(result).toBe(7);
    });
  });
});
