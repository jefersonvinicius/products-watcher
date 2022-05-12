import { MailBox, SendAlertParams } from '@app/infra/mailing/mail-box';

export class MailBoxNodeMailer implements MailBox {
  async sendAlert(params: SendAlertParams): Promise<void> {
    // TODO
  }
}
