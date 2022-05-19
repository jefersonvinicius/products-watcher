import { MailBox, SendAlertParams } from '@app/infra/mailing/mail-box';
import * as aws from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';

export class MailBoxNodeMailer implements MailBox {
  private transport: nodemailer.Transporter;

  constructor(secretAccessKey: string, accessKeyId: string) {
    const client = new aws.SESClient({
      region: 'us-east-1',
      credentials: {
        secretAccessKey,
        accessKeyId,
      },
    });
    this.transport = nodemailer.createTransport({
      SES: { ses: client, aws },
    });
  }

  async sendAlert(params: SendAlertParams): Promise<void> {
    const { alert, product } = params;
    await this.transport.sendMail({
      from: 'jeferson.viniciuscrc@gmail.com',
      to: 'jefersonvinicius.developer@gmail.com',
      subject: `Alerta ${alert.operation} ${alert.value}`,
      html: `Produto ${product.name} atingiu seu alerta<br/>${product.price} é ${alert.operation} que ${alert.value}`,
    });
  }
}
