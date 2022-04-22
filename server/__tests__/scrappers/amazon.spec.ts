import { ProductSnapshot } from '@app/core/entities/product';
import { AmazonScrapper } from '@app/scrappers/amazon';

function createSut() {
  const sut = new AmazonScrapper();
  return { sut };
}

describe('AmazonScrapper', () => {
  it('should get product correctly on type page 1', async () => {
    const { sut } = createSut();
    const product = await sut.scrap('https://www.amazon.com.br/gp/product/B07K986YLL');
    expect(product).toStrictEqual<ProductSnapshot>({
      url: 'https://www.amazon.com.br/gp/product/B07K986YLL',
      name: 'Webcam Full HD Logitech C920s com Microfone Embutido e Proteção de Privacidade para Chamadas e Gravações em Video Widescreen 1080p - Compatível com Logitech Capture',
      price: 369.9,
    });
  });

  it('should get book product with two prices correctly', async () => {
    const { sut } = createSut();
    const product = await sut.scrap('https://www.amazon.com.br/gp/product/8575225634');
    expect(product).toStrictEqual<ProductSnapshot>({
      url: 'https://www.amazon.com.br/gp/product/8575225634',
      name: 'Entendendo Algoritmos: Um Guia Ilustrado Para Programadores e Outros Curiosos',
      price: 47.3,
    });
  });

  it('should get book product with one price correctly', async () => {
    const { sut } = createSut();
    const product = await sut.scrap(
      'https://www.amazon.com.br/codificador-limpo-conduta-programadores-profissionais/dp/8576086476'
    );
    expect(product).toStrictEqual<ProductSnapshot>({
      url: 'https://www.amazon.com.br/codificador-limpo-conduta-programadores-profissionais/dp/8576086476',
      name: 'O codificador limpo: Um código de conduta para programadores profissionais',
      price: 46.9,
    });
  });
});
