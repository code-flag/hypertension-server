
import { PrismaClient } from "@prisma/client";
import { prisma } from './../config/database';


export const checkIfClientExists = async (phoneNumber: string) => {
  const client = await prisma.screening.findUnique({
    where: { phone_number: phoneNumber },
  });
  return client;
};

export const createClientScreening = async (
  phoneNumber: string,
  gender: string,
  age: number,
  ppmvAgentId: number,
  facilityAgentId: number
) => {
  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return await prisma.screening.create({
    data: {
      phone_number: phoneNumber,
      gender,
      age,
      verification_code: verificationCode,
      ppmv_agent_id: ppmvAgentId,
      facility_agent_id: facilityAgentId,
    },
  });
};

export const sendNotification = async (phoneNumber: string, message: string) => {
  // Use Africa's Talking SDK to send SMS
};
