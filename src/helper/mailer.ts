import { config } from "dotenv";
import { createTransport } from "nodemailer";
import debug from "debug";

config();

const DEBUG = debug("dev");

const transporter = createTransport({
  port: Number(process.env.EMAIL_PORT),
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
  tls: { rejectUnauthorized: false },
});

export async function sendMail(
  to: string,
  subject: string,
  html: any,
  attachment = null,
  isAttachment = false
) {
  const mailInfo: any = {
    from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    attachDataUrls: true,
    html: html,
    attachments: isAttachment ? attachment : [],
  };

  transporter.sendMail(mailInfo, (error, info) => {
    if (error) {
      console.log("error ", error);
      
      DEBUG(error);
    }
    return true;
  });
}

export async function sendBulkMail(bcc: any, subject: string, html: any) {
  const mailInfo = {
    from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    bcc: bcc,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailInfo, (error, info) => {
    if (error) {
      DEBUG(error);
    }

    return true;
  });
}
