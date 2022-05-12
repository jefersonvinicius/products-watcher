import { makeCheckProductPriceUseCase } from '@app/factories/use-cases/check-product-price-usecase';
import { makeFetchAllProductsUseCase } from '@app/factories/use-cases/fetch-all-products-usecase';
import { dataSource } from '@app/infra/database/typeorm/datasource';
import { Pagination } from '@app/shared/pagination';

let running = false;
let page = 1;

async function productsWatcher() {
  if (running) return;

  try {
    running = true;
    const result = await makeFetchAllProductsUseCase().perform({
      pagination: Pagination.make({ page, perPage: 1 }),
    });
    const product = result.products?.[0];
    if (!product) {
      page = 0;
      throw Error('Without products, restarting...');
    }

    console.log(`Checking the product: ${product.id}`);
    await makeCheckProductPriceUseCase().perform({
      productId: product.id!,
    });
  } catch (error: any) {
    console.log('[ERROR]: ', error?.message);
  } finally {
    running = false;
    page++;
  }
}

dataSource.initialize().then(() => {
  setInterval(productsWatcher, 1000);
});
