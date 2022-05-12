import { Product, ProductNotFound } from '@app/core/entities/product';
import { AlertsRepository } from '@app/core/repositories/alerts';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';
import { MailBox } from '@app/infra/mailing/mail-box';
import { Scrapper } from '@app/scrappers';

type CheckProductPriceParams = {
  productId: number;
};

type CheckProductPriceResult = {
  product: Product;
};

export class CheckProductPriceUseCase implements UseCase<CheckProductPriceParams, CheckProductPriceResult> {
  constructor(
    private scrapper: Scrapper,
    private productsRepository: ProductsRepository,
    private alertsRepository: AlertsRepository,
    private scrappingCache: ScrappingCache,
    private mailBox: MailBox
  ) {}

  async perform(params: CheckProductPriceParams): Promise<CheckProductPriceResult> {
    const product = await this.productsRepository.findByIdWithAlerts(params.productId);
    if (!product) throw new ProductNotFound(params.productId);
    const snapshot = await this.scrapper.scrap(product.url);
    await this.scrappingCache.set(product.url, snapshot);
    if (product.price === snapshot.price) return { product: product };
    const productUpdated = await this.productsRepository.addProductPriceFromSnapshot({
      productId: params.productId,
      snapshot,
    });
    for (const alert of productUpdated.alerts ?? []) {
      if (!alert.isAlertable({ price: productUpdated.price })) continue;
      this.mailBox.sendAlert({ alert, product: productUpdated });
      alert.changeToSended();
      await this.alertsRepository.save(alert);
    }
    return { product: productUpdated };
  }
}
