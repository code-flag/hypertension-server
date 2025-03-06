import { Request, Response } from "express";
import {
  checkIfClientExists,
  createClientScreening,
  sendNotification,
} from "../services/ussd.services";
import { prisma } from "../config/database";
import { BadRequestError, NotFoundError, ServerError } from "../helper/error";
import { returnMsg } from "../helper/message-handler";
import { RewardService } from "./incentive.controller";
import { generateOTP } from "./../helper/generate-otp";
import { sendMail } from "../helper/mailer";
import { NigeriaBulkSMS, SMSHandler } from "./../helper/sms";

const sms = new SMSHandler(NigeriaBulkSMS.init());

// Enums
enum EScreeningResult {
  negative = 2,
  positive = 1,
  pending = 0,
}

enum EGender {
  male = 1,
  female = 2,
}

export class UssdController extends RewardService {
  responseData: any;
  public static ussdController: UssdController;

  constructor(private serviceCode: any, private user: any) {
    super();
  }

  async processRequest() {
    switch (this.user.userType) {
      case "ppmv":
        return await this.ppmvActions(this.user.action);
      case "client":
        return await this.clientAction();
      case "provider":
        return await this.facilityAction();
      default:
        this.errorResponse();
    }

    return this.responseData;
  }

  async ppmvActions(actionType: any) {
    console.log("actionType", actionType);
    switch (actionType) {
      case "onboarding":
        return await this.onboardClientForScreening(this.serviceCode.slice(3));
      case "screening-status":
        return await this.updateScreeningStatus(this.serviceCode.slice(3));
      default:
        return this.errorResponse();
    }

    this.serviceResponse();
  }

  clientAction() {
    // clain reward
    this.responseData = {
      message: "request completed",
      error: false,
      data: [],
    };
  }
  async facilityAction() {
    console.log("action called");
    await this.confirmScreeningStatus(this.serviceCode.slice(2));
    return this.serviceResponse();
  }

  serviceResponse() {
    return this.responseData;
  }
  errorResponse() {
    return (this.responseData = {
      message: "Invalid service code",
      error: true,
      data: [],
    });
  }

  airtime = {
    send: (data: any) => {
      console.log("airtime data", data);
      return { success: true, error: false };
    },
  };

  checkIfClientExists = async (phoneNumber: string) => {
    const client = await prisma.screening.findUnique({
      where: { phoneNumber: phoneNumber },
    });
    return client;
  };

  checkIfPpmvExists = async (ppmvCode: string) => {
    const ppmv = await prisma.ppmvAgent.findUnique({
      where: { ppmvCode: ppmvCode },
    });
    return ppmv;
  };

  // Endpoint to create screening
  onboardClientForScreening = async (clientData: any[]) => {
    try {
      // Parse the USSD code
      const [phoneNumber, gender, age] = clientData;

      // check if client is not existing yet
      let isClientExisting: any = await this.checkIfClientExists(phoneNumber);

      if (isClientExisting) {
        throw new BadRequestError("Client already exist");
      }
      // Prepare the screening data
      const clientCode = await generateOTP(6);
      console.log("client code ", clientCode);
      const data = {
        phoneNumber,
        gender: gender === EGender.male ? "male" : "female",
        age: parseInt(age),
        screeningResult: "pending", // "pending"
        ppmvCode: this.user?.data?.code,
        verificationCode: clientCode,
        state: this.user.data.state,
        lga: this.user.data.lga,
        location: this.user.data.location,
        // createdAt: new Date(),
        // updatedAt: new Date(),
      };

      console.log("creating screening", data);
      // Save to the database
      let result: any;
      try {
        result = await prisma.screening.create({ data: data });
      } catch (error) {
        console.log("errorrrr ", error);
      }

      console.log("result ", result);
      if (!result) {
        throw new BadRequestError("Failed to create client!");
      }

      // send screening code to client phone number
      try {
        let resp = await sms.sendMessage(
          `Welcome to PSI!\nYour Screening Code is ${clientCode}`,
          [phoneNumber]
        );
        if (!resp.status) {
          console.log("Could not send message to client");
        }
      } catch (error) {}

      try {
        console.log("creating ppmv");
        // save ppmv code and email if not saved
        if (!(await this.checkIfPpmvExists(this.user?.data?.code))) {
          const ppmvData = {
            ppmvCode: this.user?.data?.code,
            email: this.user?.data?.email,
          }; // Save to the database
          await prisma.ppmvAgent.create({ data: ppmvData });
        }

        console.log("sending mail");

        // await sendMail(
        //   this.user.data.email,
        //   "PSI Screening Incentive",
        //   `
        //   Dear partner,
        //   <p>
        //     Thank you for initiating the client screenings as part of our health project.
        //     Here is the client code to proceed ${clientCode}
        //   </p>
        //   <p>
        //     Best Regards,
        //     PSI Team
        //   </p>
        //   `
        // );
      } catch (error) {
        console.log("error", error);
      }

      this.responseData = {
        message: "Screening created successfully.",
        error: false,
        data: result,
      };

      return this.responseData;

      // Respond with success
      // return returnMsg(res, result, "Screening created successfully.");
    } catch (error: any) {
      this.responseData = {
        message: error.message,
        error: true,
        data: error,
      };
      return this.responseData;
    }
  };

  // Endpoint to update screening status from USSD code
  updateScreeningStatus = async (requestData: any[]) => {
    try {
      console.log("requestData ", requestData);
      // Parse the USSD code
      const [phoneNumber, clientCode, screeningStatus] = requestData;

      // check screening status code if its valid
      if (
        ![EScreeningResult.negative, EScreeningResult.positive].includes(
          Number(screeningStatus)
        )
      ) {
        throw new BadRequestError("Invalid screening status");
      }

      // Find the screening record by phone number and client code
      const screening: any = await prisma.screening.findFirst({
        where: {
          phoneNumber,
          verificationCode: clientCode, // Assuming `clientCode` is used as `verificationCode`
        },
      });

      if (!screening) {
        throw new NotFoundError("Screening record not found.");
      }

      if (screening.screeningResult !== "pending") {
        throw new BadRequestError("Screening captured already");
      }

      // Update the screening result
      const updatedScreening = await prisma.screening.update({
        where: {
          id: screening.id,
        },
        data: {
          screeningRewardStatus: true,
          screeningResult:
            screeningStatus === EScreeningResult.positive
              ? "positive"
              : "negative", // Update the screening result
        },
      });

      try {
        // record ppmv screening reward
        this.screeningReward(this.user?.data?.code);

        //  await sendMail(
        //    this.user.data.email,
        //    "PSI Screening Incentive",
        //    `
        //    Dear partner,
        //    <p>
        //      Thank you for completing the client screenings as part of our health project.
        //      We are pleased to inform you that the incentive for your work has been processed.
        //    </p>
        //    <p>
        //      Best Regards,
        //      PSI Team
        //    </p>
        //    `
        //  );
      } catch (error) {
        console.log("error ", error);
      }

      // Respond with success
      this.responseData = {
        message: "Screening status updated successfully.",
        error: false,
        data: [],
      };
      return this.responseData;
    } catch (error: any) {
      this.responseData = { message: error.message, error: true, data: [] };
      return this.responseData;
    }
  };

  // Confirm Screening at Facility
  confirmScreeningStatus = async (requestData: any[]) => {
    const [phoneNumber, screeningStatus] = requestData;

    // check screening status code if its valid
    if (
      ![EScreeningResult.negative, EScreeningResult.positive].includes(
        screeningStatus
      )
    ) {
      throw new BadRequestError("Invalid screening status");
    }

    const screening = await prisma.screening.findUnique({
      where: { phoneNumber },
    });

    if (!screening) {
      throw new NotFoundError("Screening record not found.");
    }

    if (screening.confirmationResult !== "pending") {
      throw new BadRequestError("Screening captured already");
    }

    const updatedScreening = await prisma.screening.update({
      where: { phoneNumber },
      data: {
        confirmationResult:
          screeningStatus === EScreeningResult.positive
            ? "positive"
            : "negative",
        facilityCode: this.user.data.facilityCode,
        facilityProviderCode: this.user.data.code,
      },
    });

    // grant refer reward irrespective of the status
    try {
      await this.refererReward(screening.ppmvCode);

      await this.updateScreeningRewardStatus(
        { phoneNumber },
        { referrerRewardStatus: true }
      );
    } catch (error) {
      console.log("reward error", error);
    }

    if (screeningStatus === EScreeningResult.positive) {
      // Send client airtime reward

      // Notify PPMV
      try {
        await this.elevatedScreeningReward(screening.ppmvCode);
        await this.updateScreeningRewardStatus(
          { phoneNumber },
          { elevatedRewardStatus: true }
        );
      } catch (error) {
        console.log("reward error", error);
      }

      const ppmv: any = await this.checkIfPpmvExists(screening.ppmvCode);

      if (ppmv) {
        // await sendMail(
        //   ppmv?.ppmvEmail,
        //   "PSI Screening Incentive",
        //   `
        //       Dear partner,
        //       <p>
        //         Thank you for completing the client screenings as part of our health project.
        //         We are pleased to inform you that the incentive for your work has been processed.
        //       </p>
        //       <p>
        //         Best Regards,
        //         PSI Team
        //       </p>
        //       `
        // );
      }
    } else {
      // Notify PPMV of limited incentive
      // const ppmv: any = await this.checkIfPpmvExists(screening.ppmvCode);
      // if (ppmv) {
      //   await sendMail(
      //     ppmv?.ppmvEmail,
      //     "PSI Screening Incentive",
      //     `
      //       Dear partner,
      //       <p>
      //         Thank you for completing the client screenings as part of our health project.
      //         We are pleased to inform you that the incentive for your work has been processed.
      //       </p>
      //       <p>
      //         Best Regards,
      //         PSI Team
      //       </p>
      //       `
      //   );
      // }
    }

    // Respond with success
    this.responseData = {
      message: "Screening confirmed successfully.",
      error: false,
      data: [],
    };

    return this.responseData;
  };

  async updateScreeningRewardStatus(query: any, data: any) {
    await prisma.screening.update({
      where: query,
      data: data,
    });
  }
}

export const handleUSSDRequest = async (req: any, res: Response) => {
  try {
    // console.log(
    //   "eq.serviceCode, req.user",
    //   req.body.serviceCode,
    //   req.body.user
    // );

    const ussdController: any = new UssdController(
      req.body.serviceCode,
      req.body.user
    );
    const resp: any = await ussdController.processRequest();

    // console.log("resp ", resp)

    returnMsg(res, resp?.data, resp?.message);
  } catch (error: any) {
    console.log("error ", error);
    throw new ServerError(error.message);
  }
};

export const handleUSSDRequestAfricanTalking = async (
  req: Request,
  res: Response
) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const inputs = text.split("*");
  const projectCode = inputs[0];
  const clientNumber = inputs[1];
  const gender = inputs[2] === "1" ? "male" : "female";
  const age = parseInt(inputs[3]);

  if (inputs.length === 4) {
    const client = await checkIfClientExists(clientNumber);

    if (!client) {
      const screening = await createClientScreening(
        clientNumber,
        gender,
        age,
        1, // Replace with actual ppmvAgentId
        1 // Replace with actual facilityAgentId
      );

      await sendNotification(
        clientNumber,
        `Your verification code is ${screening.verification_code}`
      );
      res.send(`CON Verification code sent to ${clientNumber}`);
    } else {
      res.send(`END Client already exists`);
    }
  } else if (inputs.length === 5) {
    const verificationCode = inputs[4];
    const client = await checkIfClientExists(clientNumber);

    if (client?.verification_code === verificationCode) {
      res.send(`END Client screening confirmed`);
    } else {
      res.send(`END Invalid verification code`);
    }
  }
};
