import config from 'config';
import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './logger';

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

// credenciais e opcoes para envio de email
const mailConfig = config.get<{
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
}>('smtp');

const transporter = nodemailer.createTransport(mailConfig);

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, 'Error sending the mail');
      return;
    }
  });
};

export default sendEmail;
