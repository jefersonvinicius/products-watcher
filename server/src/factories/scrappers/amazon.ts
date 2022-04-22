import { AmazonScrapper } from '@app/scrappers/amazon';

export function makeAmazonScrapper() {
  return new AmazonScrapper();
}
