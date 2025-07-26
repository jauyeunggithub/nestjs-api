import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: +(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    return this.transporter.sendMail({
      from: `"NestJS App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }
}
