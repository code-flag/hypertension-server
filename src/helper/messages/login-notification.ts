import { dirname } from "path";
import path from "path";
import * as fs from "fs";
import { emailFooter } from "./email-footer";
import { emailHeader } from "./email-header";

export const loginNotificationMsg = ({ name, resetPasswordLink }: any) => {
    let date = new Date();
  return {
    message: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>psi Login Notification</title>
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
            background-color: #fff;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 100%; /* Responsive */
            height: auto;
        }
        .header h1 {
            color: #333;
        }
        .content p {
            margin: 0 0 10px 0;
        }
        .button {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #ffffff;
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
                     
                        <td class="content">
                            <p>Hello ${name},</p>
                            <p>We noticed a login activity in your psi account on <strong>${date}</strong>.</p>
                            <p>If you did not initiate this login, please reset your password immediately to secure your account.</p>
                            <a href="${resetPasswordLink}" class="button" style="color: #fff; text-decoration: none" >Reset Password</a>
                            <p>For any assistance, feel free to reach out to our support team.</p>
                            <p>Best Regards,<br>The psi Team</p>
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
