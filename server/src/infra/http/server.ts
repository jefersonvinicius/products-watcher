import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { INFRA_CONFIG } from '@app/infra/config';
import { makeScrapPageUseCase } from '@app/factories/use-cases/scrap-page-usecase';
import { makeSavePageUseCase } from '@app/factories/use-cases/save-page-usecase';
import { makeFetchAllProductsUseCase } from '@app/factories/use-cases/fetch-all-products-usecase';
import { Pagination } from '@app/shared/pagination';
import { makeCheckProductPriceUseCase } from '@app/factories/use-cases/check-product-price-usecase';
import { HttpError } from '@app/infra/http/errors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/scrap', async (request, response) => {
  if (!request.query.url) throw new HttpError('Missing the url param', 400);

  const product = await makeScrapPageUseCase().perform({ url: String(request.query.url) });
  return response.status(200).json(product);
});

app.post('/products', async (request, response) => {
  if (!request.query.url) throw new HttpError('Missing the url param', 400);

  const product = await makeSavePageUseCase().perform({ url: String(request.query.url) });
  return response.status(200).json(product);
});

app.get('/products', async (request, response) => {
  const pagination = Pagination.fromExpressRequest(request);
  const result = await makeFetchAllProductsUseCase().perform({ pagination });

  return response
    .status(200)
    .json({ ...result, ...pagination, pages: pagination.totalPages({ amount: result.total }) });
});

app.post('/products/:productId/prices', async (request, response) => {
  const result = await makeCheckProductPriceUseCase().perform({
    productId: Number(request.params.productId),
  });

  return response.status(200).json({
    product: result.product,
  });
});

app.use((error: any, _: Request, response: Response, __: NextFunction) => {
  return response.status(error.statusCode ?? 500).json({ message: error?.message ?? 'Unexpected error' });
});

export function startHTTPServer() {
  app.listen(INFRA_CONFIG.SERVER_PORT, () => {
    console.log(`Serving at http://localhost:${INFRA_CONFIG.SERVER_PORT}`);
  });
}
