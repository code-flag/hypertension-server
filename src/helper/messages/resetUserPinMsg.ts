import { fileURLToPath } from "url";
import { dirname } from "path";
import { emailFooter } from "./email-footer";
import { emailHeader } from "./email-header";

const resFilename = require("url").pathToFileURL(__filename).toString();
const mydirname = dirname(resFilename);

// import * as fs from 'fs';

export const resetUserPinMsg = (data: any) => {
  return {
    message: `
    <body style="background: #fdfdff">
    <table align="center" border="0" cellpadding="0" cellspacing="0"
        width="100%" bgcolor="#fdfdff" style="border: none">
        <tbody>
     
             ${emailHeader}
            <tr >
                <td align="left" style="border: none;
                        border-bottom: 1px solid #f0f0ff;
                        padding-right: 20px;padding-left:20px">
                         
                    <div>Dear ${data.email}, </div>

                    <p style="font-size: inherit;
                    letter-spacing: inherit; line-height: inherit;
                    color: inherit;">

                    We received a request to reset the pin for your psi account. If you did not initiate this request, please disregard this email and your pin will remain unchanged.
                    If you requested, kindly click on the link below
                    <br><br>
                    <a href="staff.psi.org/reset-pin-account/${data.token}" style="background-color: #026395; color: #fff; padding: 10px 20px; cursor: pointer; text-decoration: none">Confirm Email</a>
                    
                    <br><br>
                    If the button does not work, click on the link below or copy the link to a browser tab and run it.
                    <br> https://staff.psi.org/reset-pin-account/${data.token}
                    </p>
                                      
                    <p>If you have any questions or concerns, please don't hesitate to contact us. </p>

                    Best regards, <br>
                    psi 
                    
                 <img src="cid:psi-logo.png" alt="psi-logo">
                </td>
            </tr>

            <tr style="border: none;
            background-color: #154374;
            height: 40px;
            color:white;
            padding-bottom: 20px;
            text-align: center;">
                
<td height="40px" align="center">
    <p style="color:white; line-height: 1.5em; font-style: 24px; font-weight: bold">
    psi
    </p>
    <a href="#"
    style="border:none;
        text-decoration: none;
        padding: 5px;">
            
    <img height="30"
    src=
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-twitter_20190610074030.png"
    width="30" />
    </a>
    
    <a href="#"
    style="border:none;
    text-decoration: none;
    padding: 5px;">
    
    <img height="30"
    src=
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/icon-linkedin_20190610074015.png"
width="30" />
    </a>
    
    <a href="#"
    style="border:none;
    text-decoration: none;
    padding: 5px;">
    
    <img height="20"
    src=
"https://extraaedgeresources.blob.core.windows.net/demo/salesdemo/EmailAttachments/facebook-letter-logo_20190610100050.png"
        width="24"
        style="position: relative;
            padding-bottom: 5px;" />
    </a>
</td>
</tr>
<tr>
<td style="font-family:'Open Sans', Arial, sans-serif;
        font-size:11px; line-height:18px;
        color:#999999;"
    valign="top"
    align="center">
<a href="#"
target="_blank"
style="color:#999999;
        text-decoration:underline;">PRIVACY STATEMENT</a>
        | <a href="#" target="_blank"
        style="color:#999999; text-decoration:underline;">TERMS OF SERVICE</a>
        | <a href="#"
        target="_blank"
        style="color:#999999; text-decoration:underline;">RETURNS</a><br>
                © 2021 psi. All Rights Reserved.<br>
                If you do not wish to receive any further
                emails from us, please
                <a href="www.psi.org"
                target="_blank"
                style="text-decoration:none;
                        color:#999999;">unsubscribe</a>
            </td>
            </tr>
            </tbody></table></td>
        </tr>
        <tr>
        <td class="em_hide"
        style="line-height:1px;
                min-width:700px;
                background-color:#ffffff;">
            <img alt=""
            src="images/spacer.gif"
            style="max-height:1px;
            min-height:1px;
            display:block;
            width:700px;
            min-width:700px;"
            width="700"
            border="0"
            height="1">
            </td>
        </tr>
        </tbody>
        ${emailFooter}
    </table>
</body>
`,

    attachment: [
      {
        filename: "psi-logo.png",
        path: mydirname + "/onboarding-template-images/psi-logo.png",
        cid: "psi-logo.png",
      },
    ],
  };
};
