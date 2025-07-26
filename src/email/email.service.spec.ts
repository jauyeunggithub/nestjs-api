import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn().mockResolvedValue(true);

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should send an email', async () => {
    await expect(
      service.sendMail('to@example.com', 'Subject', 'Text'),
    ).resolves.toBeTruthy();
    expect(sendMailMock).toHaveBeenCalledWith({
      from: expect.stringContaining('@'),
      to: 'to@example.com',
      subject: 'Subject',
      text: 'Text',
    });
  });
});
