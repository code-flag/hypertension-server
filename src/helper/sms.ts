// const axios = require('axios');
const FormData = require("form-data");
import axios from "axios";
import dotEnv from "dotenv";
dotEnv.config();

export class SMSHandler {
  constructor(private sender: any) {}

   public sendMessage = async (message: string, mobiles: string[], type: "text" | "call" | "audio" | "tts" = 'text'): Promise<any> => {
    return await this.sender.sendMessage(message, mobiles, type);
  }
}

export class NigeriaBulkSMS {
  private username = process.env.USER_NAME;
  private password = process.env.USER_PASS;
  private senderId = process.env.SENDER_ID;
  private baseUrl = process.env.NIGERIA_BULK_SMS_BASE_URL || "";
  public static nigeriaBulkSMS: NigeriaBulkSMS;
    // static nigeriaBulkSMS: any;

  constructor(){}

  public static  init(){
    if (!NigeriaBulkSMS.nigeriaBulkSMS) {
        NigeriaBulkSMS.nigeriaBulkSMS = new NigeriaBulkSMS()
        return NigeriaBulkSMS.nigeriaBulkSMS;
    }

    return NigeriaBulkSMS.nigeriaBulkSMS;
  }

  public sendMessage = async (
    message: string,
    mobiles: string[],
    type: "text" | "call" | "audio" | "tts" = "text"
  ) => {
    const formData = new FormData();

    const headers = {
      ...formData.getHeaders(), // Automatically sets Content-Type with boundary
      // Authorization: `Bearer YOUR_ACCESS_TOKEN`, // If API requires authentication
      // 'Custom-Header': 'CustomValue' // Any other custom headers
    };

    formData.append("username", this.username);
    formData.append("password", this.password);
    formData.append("sender", this.senderId);
    formData.append("message", message);
    formData.append("mobiles", mobiles?.join(","));
    formData.append("type", type);

    try {
      const response = await axios.post(this.baseUrl, formData, {
        headers: headers,
      });

      console.log("Response:", response.data);
      return {status: true, data: response.data};
    } catch (error: any) {
      console.error(
        "Error sending data:",
        error.response ? error.response.data : error.message
      );
      return {status: false, error: error};
    }
  };
}
