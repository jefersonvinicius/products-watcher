import { Scrapper } from '.';
import { ProductSnapshot } from '@app/core/entities/product';
import puppeteer, { Page } from 'puppeteer';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';

export class AmazonScrapper implements Scrapper {
  constructor(private scrappingCache: ScrappingCache) {}

  async scrap(url: string): Promise<ProductSnapshot> {
    return this.scrapTheUrl(url);
  }

  async scrapAndCache(url: string): Promise<ProductSnapshot> {
    const snapshot = await this.scrapTheUrl(url);
    await this.scrappingCache.set(url, snapshot);
    return snapshot;
  }

  private async scrapTheUrl(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    const productTitle = await page.waitForSelector('span#productTitle');
    const priceSpan = await this.queryForPrice(page);

    const rawName = await productTitle?.evaluate((el) => el.textContent);
    const rawPrice = await priceSpan?.evaluate((el) => el.textContent);

    await page.close();
    await browser.close();
    browser.disconnect();

    return {
      url,
      name: this.sanitizeName(rawName),
      price: this.parsePriceLabel(rawPrice),
    };
  }

  private async queryForPrice(page: Page) {
    let priceSpan = await page.$('.priceToPay > .a-offscreen');
    if (priceSpan) return priceSpan;

    priceSpan = await page.$('#a-autoid-6-announce span.a-color-price');
    if (priceSpan) return priceSpan;

    priceSpan = await page.$('#a-autoid-5 span.a-color-price');
    return priceSpan;
  }

  private sanitizeName(value: string | null | undefined) {
    return value?.trim() ?? '';
  }

  private parsePriceLabel(value: string | null | undefined) {
    const sanitized = value?.replaceAll(',', '.').replaceAll('R$', '') ?? '';
    return Number(sanitized);
  }
}
