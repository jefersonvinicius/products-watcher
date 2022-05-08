import { ProductsRepositoryTypeORM } from '@app/infra/database/products-repository-type-orm';
import { ProductORMEntity } from '@app/infra/database/typeorm/entities/product';
import { ProductPriceORMEntity } from '@app/infra/database/typeorm/entities/product-price';
import { createFakeProduct, createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { createFakeProductPrice } from '@tests/helpers/factories/product-price';
import { DataSource } from 'typeorm';

const entities = [ProductORMEntity, ProductPriceORMEntity];

describe('ProductsRepositoryTypeORM', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities,
      synchronize: true,
    });
    await dataSource.initialize();
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('addProductPriceFromSnapshot method', () => {
    it('should add the product price and update the product price', async () => {
      const snapshot = createFakeProductSnapshot();
      const sut = new ProductsRepositoryTypeORM(dataSource);
      const saved = await sut.save(createFakeProduct());

      const product = await sut.addProductPriceFromSnapshot({ productId: saved.id, snapshot });

      const productPricesRepository = dataSource.getRepository(ProductPriceORMEntity);
      const prices = await productPricesRepository.find({ where: { product: { id: product.id } } });
      expect(prices).toHaveLength(2);
      expect(product.id).toBe(saved.id);
      expect(product.price).toBe(snapshot.price);
      expect(product.prices[0].value).toBe(saved.price);
      expect(product.prices[1].value).toBe(snapshot.price);
    });

    it('should return product with previous product prices associated', async () => {
      const productPricesRepository = dataSource.getRepository(ProductPriceORMEntity);
      const snapshot = createFakeProductSnapshot();
      const productPrice = createFakeProductPrice();
      const sut = new ProductsRepositoryTypeORM(dataSource);
      const saved = await sut.save(createFakeProduct());
      await productPricesRepository.save({ ...productPrice, product: { id: saved.id } });

      const product = await sut.addProductPriceFromSnapshot({ productId: saved.id, snapshot });

      expect(product.prices).toHaveLength(3);
      expect(product.prices[0].value).toBe(saved.price);
      expect(product.prices[1].value).toBe(productPrice.value);
      expect(product.prices[2].value).toBe(snapshot.price);
    });
  });
});
