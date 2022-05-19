import { ENV } from '@app/env';
import { MailBoxNodeMailer } from '@app/infra/mailing/mail-box-node-mailer';

export function makeMailBox() {
  return new MailBoxNodeMailer(ENV.SES_SECRET_ACCESS_KEY, ENV.SES_ACCESS_KEY_ID);
}
