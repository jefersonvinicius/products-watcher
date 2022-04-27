import express, { Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { INFRA_CONFIG } from '@app/infra/config';
import { makeScrapUseCase } from '@app/factories/use-cases/scrap-page-usecase';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/scrap', async (request, response) => {
  if (!request.query.url) throw Error('Missing the url params');

  const product = await makeScrapUseCase().perform({ url: String(request.query.url) });
  return response.status(200).json(product);
});

app.use((error: Error, _: Request, response: Response) => {
  return response.status(500).json({ message: error?.message ?? 'Unexpected error' });
});

export function startHTTPServer() {
  app.listen(INFRA_CONFIG.SERVER_PORT, () => {
    console.log(`Serving at http://localhost:${INFRA_CONFIG.SERVER_PORT}`);
  });
}
