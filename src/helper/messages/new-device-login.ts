import { dirname } from "path";
import path from "path";

import * as fs from "fs";
import { emailFooter } from "./email-footer";
import { emailHeader } from "./email-header";

export const deviceChangedMsg = ({otp, name}: any) => {
  // console.log("path2: ", __dirname + "/onboarding-template-images/congratulation.png")
  return {
    message: `           
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>psi Security Alert</title>
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
        <table cellpadding="0" cellspacing="0" style="padding: 10px">
          <tr>
            <td>
            
            <div> Hi ${name}, </div> 

              <p>Please confirm you are the one that tried to log in to your account with another device. If you are the one, kindly use this OTP: <strong>${otp}</strong> else ignore this email and don't share it with anyone.</p>

              <h2>Important Information</h2>
              <p>Reports show that companies experiencing data breaches may put their customers' information at risk. psi is committed to keeping your account safe from fraud and scams. To achieve this, follow these steps to protect yourself:</p>

              <ol>
                <li>
                  <strong>Activate 2FA:</strong> Ensure that 2-Factor Authentication (2FA) is active whenever you log in. We strongly advise enabling 2FA on your first login.
                </li>
                <li>
                  <strong>Change your passwords and transaction PIN regularly:</strong> Use a strong password with a mix of upper- and lower-case characters, numbers, and punctuation marks, with six characters as a minimum. Do not share your PIN and password with anyone.
                </li>
                <li>
                  <strong>Monitor your accounts:</strong> Regularly check and monitor your accounts for any unusual activity or transactions.
                </li>
                <li>
                  <strong>Respond to security concerns:</strong> If you feel your account has been compromised, change your security details quickly and call our support line immediately.
                </li>
                <li>
                  <strong>Be cautious of suspicious requests:</strong> If anyone calls you asking for your password, PIN, personal information, or to transfer money, be aware that fraudsters may impersonate companies. psi/psi will never ask for this information, so never share it.
                </li>
                <li>
                  <strong>Report suspicious emails:</strong> Forward all suspicious emails claiming to be from psi/psi to <a href="mailto:itsupport@psi.org">itsupport@psi.org</a>. We'll never send you a link that takes you straight to the online login page.
                </li>
              </ol>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>Kind regards,<br>
              The psi/psi Team<br>
              <a href="https://psi.org" target="_blank">https://psi.org</a><br>
              +234 906 247 247</p>

              <p>You are receiving this email because you recently interacted with us. If you did not do this, please contact us immediately.</p>

              <p>NOTICE: The content of this email is intended solely for the use of the individual or entity to whom it is addressed. If you have received this communication in error, please refrain from forwarding, copying, or in any way disseminating it.</p>
            </td>
          </tr>
          ${emailFooter}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`,

    attachments: [
      {
        filename: "psi-logo.png",
        path: __dirname + "/onboarding-template-images/psi-logo.png",
        cid: "psi",
      },
      {
        filename: "congratulation.png",
        path: __dirname + "/onboarding-template-images/congratulation.png",
        cid: "congratulation",
      },
    ],
  };
};
