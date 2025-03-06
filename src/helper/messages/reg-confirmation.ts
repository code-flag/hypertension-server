
import { emailFooter } from "./email-footer";
import { emailHeader } from "./email-header";

export const regConfirmationMsg = (data: any) => {
  // console.log("path2: ", __dirname + "/onboarding-template-images/congratulation.png")
  return {
    message: `           

      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>psi OTP Verification</title>
  <style>
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      text-size-adjust: 100%;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    table {
      border-spacing: 0;
      width: 100%;
    }
    table td {
      padding: 0;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      display: block;
    }
    .content {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border-collapse: collapse;
      border: none;
      background-color: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .content h1, .content h2 {
      font-size: 20px;
      margin: 0 0 10px 0;
    }
    .content p {
      margin: 0 0 10px 0;
    }
    .footer {
      text-align: center;
      font-size: 0.9em;
      color: #888;
      margin-top: 20px;
    }
    .footer a {
      color: #333;
    }
    .button {
      display: inline-block;
      margin: 10px 0;
      padding: 10px 20px;
      color: #fff;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0">
             ${emailHeader}
    <tr>
      <td align="center">
        <table  cellpadding="0" cellspacing="0" style="padding: 10px">
          <tr>
            <td>
              <div>Dear ${data.firstName},</div>

              <p style="font-size: inherit; letter-spacing: inherit; line-height: inherit; color: inherit;">
                Thank you for choosing our service. Your OTP is <b>${data.otp}</b>. Please use this code to complete your registration.
              </p>

              <p>Note: This OTP is only valid for 15 minutes.</p>

              <p>If you have any questions or concerns, please don't hesitate to contact us.</p>

              <p>Best regards,<br>psi</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>Kind regards,<br>
              The psi/psi Team<br>
              <a href="https://psi.org" target="_blank">https://psi.org</a><br>
              +234 906 247 247</p>

              <p>You are receiving this email because you recently created an account with us. If you did not do this, please contact us immediately.</p>

              <p>
              NOTICE: The content of this email is intended solely for the
                  use of the individual or entity to whom it is addressed. If
                  you have received this communication in error, please refrain
                  from forwarding, copying, or in any way disseminating it. Please notify
                  the author by replying to this e-mail immediately
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${emailFooter}
  </table>
</body>
</html>


`,

    attachments: [
     
    ],
  };
};
