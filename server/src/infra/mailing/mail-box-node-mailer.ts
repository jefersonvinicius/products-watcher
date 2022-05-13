import { MailBox, SendAlertParams } from '@app/infra/mailing/mail-box';
import nodemailer from 'nodemailer';

export class MailBoxNodeMailer implements MailBox {
  private transport: nodemailer.Transporter;

  constructor(private email: string, private password: string) {
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.email,
        pass: this.password,
      },
    });
  }

  async sendAlert(params: SendAlertParams): Promise<void> {
    const { alert, product } = params;
    await this.transport.sendMail({
      from: this.email,
      to: 'jeferson.viniciuscrc@gmail.com',
      subject: `Alerta ${alert.operation} ${alert.value}`,
      html: `Produto ${product.name} atingiu seu alerta<br/>${product.price} é ${alert.operation} que ${alert.value}`,
    });
  }
}
