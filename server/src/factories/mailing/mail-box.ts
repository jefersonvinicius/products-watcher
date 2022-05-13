import { ENV } from '@app/env';
import { MailBoxNodeMailer } from '@app/infra/mailing/mail-box-node-mailer';

export function makeMailBox() {
  return new MailBoxNodeMailer(ENV.EMAIL, ENV.PASSWORD);
}
