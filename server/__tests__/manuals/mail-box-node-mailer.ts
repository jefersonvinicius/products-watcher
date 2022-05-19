import { makeMailBox } from '@app/factories/mailing/mail-box';
import { createFakeAlert } from '@tests/helpers/factories/alerts';
import { createFakeProduct } from '@tests/helpers/factories/product';

export default async function () {
  const mailBox = makeMailBox();
  await mailBox.sendAlert({
    alert: createFakeAlert(),
    product: createFakeProduct({ name: 'Produtinho' }),
  });
  console.log('Alert sended');
}
