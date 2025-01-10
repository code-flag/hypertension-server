import { Request, Response } from "express";
import {
  checkIfClientExists,
  createClientScreening,
  sendNotification,
} from "../services/ussd.services";
import { prisma } from "config/database";
import { BadRequestError, NotFoundError } from "helper/error";
import { returnMsg } from "helper/message-handler";
import { RewardService } from "./incentive.controller";

enum EProjectType {
  hhaProject = 1,
}

enum EUserType {
  ppmv = 1,
  client = 2,
  facility = 3,
}

enum ERequestType {
  clientOnboarding = 1,
  clientStatusUpdate = 2,
}

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

/**
 *   
 * *123*1*1*1*codes ppmv
  shortcode project-code userType requestType ...requestdata
  *123*1*1*2*codes ppmv
  shortcode project-code userType requestType ...requestdata
  *123*1*2*codes client
  shortcode project-code userType ...requestdata
  *123*1*3*codes facility
  shortcode project-code userType ...requestdata
 */
export class ussdController extends RewardService {
  responseData: any;
  inputCodes: any[] = [];

  constructor(private serviceCode: any, private reqPhoneNumber: string) {
    super();
    let codes = this.serviceCode.split("*");
    codes[codes.length - 1] = parseInt(codes[codes.length - 1]);
    this.inputCodes = codes.slice(2);
  }

  processRequest(inputData: any[]) {
    if (inputData[0] === EProjectType.hhaProject) {
      switch (inputData[1]) {
        case EUserType.ppmv:
          this.ppmvActions(inputData[2]);
          break;
        case EUserType.client:
          this.clientAction();
          break;
        case EUserType.facility:
          this.facilityAction();
          break;
        default:
          this.errorResponse();
      }
    } else {
      return this.errorResponse();
    }

    return this.responseData;
  }

  ppmvActions(requestCode: any) {
    switch (requestCode) {
      case ERequestType.clientOnboarding: this.onboardClientForScreening(this.inputCodes.slice(3))
      case ERequestType.clientStatusUpdate: this.updateScreeningStatus(this.inputCodes.slice(3))
      default:
        this.errorResponse();
    }

    this.serviceResponse()
  }

  clientAction() {
// clain reward 

    this.responseData = {
      message: "request completed",
      error: false,
      data: [],
    };
  }
  facilityAction() {
    this.confirmScreeningStatus(this.inputCodes.slice(2));
    this.serviceResponse();
  }

  serviceResponse() {
    return this.responseData;
  }
  errorResponse() {
    return this.responseData = {
      message: "Invalid service code",
      error: true,
      data: [],
    };
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

  checkIfPpmvExists = async (phoneNumber: string) => {
    const ppmv = await prisma.ppmvAgent.findUnique({
      where: { phoneNumber: phoneNumber },
    });
    return ppmv;
  };

  checkIfFacilityExists = async (phoneNumber: string) => {
    const facility = await prisma.facilityAgent.findUnique({
      where: { phoneNumber: phoneNumber },
    });
    return facility;
  };

  // Endpoint to create screening
  onboardClientForScreening = async (clientData: any[]) => {
    try {
      // Parse the USSD code
      const [ phoneNumber, gender, age ] = clientData;

      let isPpmvValid: any = await this.checkIfPpmvExists(this.reqPhoneNumber);
      if (!isPpmvValid) {
        throw new BadRequestError("Invalid agent code");
      }

      // check if client is not existing yet
      let isClientExisting: any = await checkIfClientExists(phoneNumber);

      if (isClientExisting) {
        throw new BadRequestError("Client already exist");
      }
      // Prepare the screening data
      const data = {
        phoneNumber,
        gender: gender === EGender.male ? "male" : "female",
        age: parseInt(age),
        screeningStatus: 'pending', // "pending"
        ppmvId: isPpmvValid.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to the database
      const result = await prisma.screening.create({ data });

      if (!result) {
        throw new BadRequestError("Failed to create client!")
      }

      this.responseData = {message: "Screening created successfully.", error: false, data: []}

      // Respond with success
      // return returnMsg(res, result, "Screening created successfully.");
    } catch (error: any) {
      this.responseData = {message: error.message, error: true, data: []}
    }
  };

  // Endpoint to update screening status from USSD code
  updateScreeningStatus = async (requestData: any[]) => {
    try {
     
      // Parse the USSD code
      const [phoneNumber, clientCode, screeningStatus ] = requestData;


      // check screening status code if its valid 
      if (![EScreeningResult.negative, EScreeningResult.positive].includes(screeningStatus)) {
        throw new BadRequestError("Invalid screening status")
      }

      let isPpmvValid: any = await this.checkIfPpmvExists(this.reqPhoneNumber);
      if (!isPpmvValid) {
        throw new BadRequestError("Invalid agent code");
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

      // Update the screening result
      const updatedScreening = await prisma.screening.update({
        where: {
          id: screening.id,
        },
        data: {
          screeningResult: screeningStatus  ===  EScreeningResult.positive ? 'positive' : "negative", // Update the screening result
        },
      });

      // Respond with success
      this.responseData = {message:  "Screening status updated successfully.", error: false, data: []}
      
    } catch (error: any) {
      this.responseData = {message: error.message, error: true, data: []}
    }
  };

  // Confirm Screening at Facility
  confirmScreeningStatus = async (requestData: any[]) => {
      const [ phoneNumber, screeningStatus ] = requestData;

         // check screening status code if its valid 
        if (![EScreeningResult.negative, EScreeningResult.positive].includes(screeningStatus)) {
          throw new BadRequestError("Invalid screening status")
        }
  
      const screening = await prisma.screening.findUnique({
          where: { phoneNumber }
      });
  
      if (!screening) {
          throw new NotFoundError("Screening record not found.");
      }

      let isFacilityValid: any = await this.checkIfFacilityExists(this.reqPhoneNumber);
      if (!isFacilityValid) {
        throw new BadRequestError("Invalid facility agent code");
      }
    
      const updatedScreening = await prisma.screening.update({
          where: { phoneNumber },
          data: {
            confirmationResult:  screeningStatus  ===  EScreeningResult.positive ? 'positive' : "negative",
              facilityId: isFacilityValid.id
          }
      });
  
      if (screeningStatus === EScreeningResult.positive) {
          // Send client airtime reward
         
          // Notify PPMV
          await prisma.notification.create({
              data: {
                  phoneNumber: screening.phoneNumber,
                  message: "You have received a full incentive.",
                  type: "reward",
                  createdAt: new Date()
              }
          });
      } else {
          // Notify PPMV of limited incentive
          await prisma.notification.create({
              data: {
                  phoneNumber: screening.phoneNumber,
                  message: "You have received a limited incentive.",
                  type: "reward",
                  createdAt: new Date()
              }
          });
      }
  
       // Respond with success
       this.responseData = {message:  "Screening confirmed successfully.", error: false, data: []}
  }
  
}

// export const handleUSSDRequest = async (req: Request, res: Response) => {
//   const { sessionId, serviceCode, phoneNumber, text } = req.body;

//   const inputs = text.split("*");
//   const projectCode = inputs[0];
//   const clientNumber = inputs[1];
//   const gender = inputs[2] === "1" ? "male" : "female";
//   const age = parseInt(inputs[3]);

//   if (inputs.length === 4) {
//     const client = await checkIfClientExists(clientNumber);

//     if (!client) {
//       const screening = await createClientScreening(
//         clientNumber,
//         gender,
//         age,
//         1, // Replace with actual ppmvAgentId
//         1 // Replace with actual facilityAgentId
//       );
//       await sendNotification(
//         clientNumber,
//         `Your verification code is ${screening.verification_code}`
//       );
//       res.send(`CON Verification code sent to ${clientNumber}`);
//     } else {
//       res.send(`END Client already exists`);
//     }
//   } else if (inputs.length === 5) {
//     const verificationCode = inputs[4];
//     const client = await checkIfClientExists(clientNumber);

//     if (client?.verification_code === verificationCode) {
//       res.send(`END Client screening confirmed`);
//     } else {
//       res.send(`END Invalid verification code`);
//     }
//   }
// };
