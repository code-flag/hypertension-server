// images
const facebook =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A36%3A02.504Z-facebook.png";
const facebookLink =
  "https://www.facebook.com/share/yZYBLRuAy3ZNwyQy/?mibextid=LQQJ4d";
const twitter =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A37%3A13.083Z-twitter%20x.png";
const twitterLink = "https://x.com/psi_ng?s=21";
const instagram =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A42%3A50.574Z-ig.png";
const instagramLink =
  "https://www.instagram.com/psi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
const linkedin =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A43%3A20.246Z-linkedin.png";
const linkedinLink = "https://www.linkedin.com/company/psing/";
const whatsapp =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A43%3A43.349Z-whatsapp.png";
const whatsappLink = "#";
const pciDss =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A45%3A07.682Z-pngwing.com%20%2823%29.png";
const cbn =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A44%3A24.412Z-Central_Bank_of_Nigeria_logo.svg.png";
const security =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A39%3A55.195Z-image-Photoroom.png";
const ndpr =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A45%3A47.937Z-ndpb-shield%20-%20Copy.png";
const psiLogo =
  "https://psi-store.s3.eu-central-1.amazonaws.com/psi-tester/profile-pic/2024-09-27T13%3A41%3A06.948Z-psi%20new.png";

export const emailFooter = `
  <tr>
    <td style="padding: 20px; background-color: #227A8E; color: white; text-align: center; font-family: Arial, sans-serif;">
      <table cellspacing="0" cellpadding="0" width="100%" style="margin: 0 auto;">
        <!-- Logo and Social Icons -->
        <tr>
          <td colspan="2" style="padding-bottom: 20px;">
            <table cellspacing="0" cellpadding="0" width="100%" style="text-align: center;">
              <tr>
                <!-- Logo Section -->
                <td style="text-align: left; vertical-align: middle; padding: auto">
                  <img src="${psiLogo}" alt="psi Logo" style="width: 100px; height: auto;">
                </td>
                <!-- Social Media Icons -->
                <td style="text-align: right; vertical-align: middle;">
                  <table cellspacing="0" cellpadding="0" style="display: inline-block;">
                    <tr>
                      <td style="padding: 0 5px;">
                        <a href="${facebookLink}" target="_blank">
                          <img src="${facebook}" alt="Facebook" style="width: 25px; height: 25px;">
                        </a>
                      </td>
                      <td style="padding: 0 5px;">
                        <a href="${linkedinLink}" target="_blank">
                          <img src="${linkedin}" alt="LinkedIn" style="width: 25px; height: 25px;">
                        </a>
                      </td>
                      <td style="padding: 0 5px;">
                        <a href="${instagramLink}" target="_blank">
                          <img src="${instagram}" alt="Instagram" style="width: 25px; height: 25px;">
                        </a>
                      </td>
                      <td style="padding: 0 5px;">
                        <a href="${twitterLink}" target="_blank">
                          <img src="${twitter}" alt="Twitter" style="width: 25px; height: 25px;">
                        </a>
                      </td>
                      <td style="padding: 0 5px;">
                        <a href="${whatsappLink}" target="_blank">
                          <img src="${whatsapp}" alt="WhatsApp" style="width: 25px; height: 25px;">
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Contact Information -->
        <tr>
          <td colspan="2" style="text-align: center; padding-bottom: 10px;">
            <p style="margin: 0; color: white; font-size: 14px;">
              For more information on our products and services, please call our 24/7 contact centre on 
              <a href="tel:+2348096247247" style="color: #FFD700; text-decoration: none;">+234 809 624 7247</a>.
            </p>
            <p style="margin: 0; color: white; font-size: 14px;">
              Alternatively, send an email to 
              <a href="mailto:info@psi.org" style="color: #FFD700; text-decoration: none;">info@psi.org</a>
              or visit our website at 
              <a href="http://www.psi.org" target="_blank" style="color: #FFD700; text-decoration: none;">www.psi.org</a>
            </p>
          </td>
        </tr>
        <!-- Legal Section -->
        <tr>
          <td colspan="2" style="text-align: center; padding-bottom: 20px;">
            <p style="margin: 10px 0; color: white; font-size: 12px;">© 2024. psi Limited.</p>
            <a href="https://psi.org/terms" style="color: #FFD700; text-decoration: none; font-size: 12px;">Privacy Policy</a> |
            <a href="https://psi.org/terms" style="color: #FFD700; text-decoration: none; font-size: 12px;">Terms and Conditions</a> |
            <a href="#" style="color: #FFD700; text-decoration: none; font-size: 12px;">
              Address: Suites A4, 1st floor, AP Plaza, 28 Adetokunbo Ademola Crescent, Wuse 2, Abuja
            </a>
          </td>
        </tr>
        <!-- Certification Logos -->
        <tr style="padding: auto" >
            <td colspan="2" style="text-align: center; padding-top: 20px;">
                <table cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                    <td style="padding: 0 10px;">
                    <img src="${cbn}" alt="CBN Logo" style="width: 50px;">
                    </td>
                    <td style="padding: 0 10px;">
                    <img src="${pciDss}" alt="PCI Logo" style="width: 100px;  background: #fff">
                    </td>
                    <td style="padding: 0 10px;">
                    <img src="${ndpr}" alt="ISO Logo" style="width: 50px;">
                    </td>
                    <td style="padding: 0 10px;">
                    <img src="${security}" alt="Security Standards Council" style="width: 50px;  background: #fff">
                    </td>
                </tr>
                </table>
            </td>
        </tr>

      </table>
    </td>
  </tr>
`;
