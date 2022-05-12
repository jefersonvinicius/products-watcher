import { MailBoxNodeMailer } from '@app/infra/mailing/mail-box-node-mailer';

export function makeMailBox() {
  return new MailBoxNodeMailer();
}
