import { Request, Response } from "express";
import {
  checkIfClientExists,
  createClientScreening,
  sendNotification,
} from "../services/screeningService";

export const handleUSSDRequest = async (req: Request, res: Response) => {
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
