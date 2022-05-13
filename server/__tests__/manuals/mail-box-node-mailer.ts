import { makeMailBox } from '@app/factories/mailing/mail-box';
import { createFakeAlert } from '@tests/helpers/factories/alerts';
import { createFakeProduct } from '@tests/helpers/factories/product';

function run() {
  const mailBox = makeMailBox();
  mailBox.sendAlert({
    alert: createFakeAlert(),
    product: createFakeProduct({ name: 'Produtinho' }),
  });
}

run();
