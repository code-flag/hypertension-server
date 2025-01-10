import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

// Get all incentives with pagination
export const getAllIncentives = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, type, beneficiaryType } = req.query;

    const query: any = {};
    if (type) {
      query['type'] = type;
    }
    if (beneficiaryType) {
      query['beneficiaryType'] = beneficiaryType;
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const incentives = await prisma.incentives.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalIncentives = await prisma.incentives.count({
      where: query,
    });

    returnMsg(res, {
      data: incentives,
      total: totalIncentives,
      totalPages: Math.ceil(totalIncentives / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Incentives retrieved successfully.");
  } catch (error) {
    console.error("Error fetching incentives:", error);
    res.status(500).json({ message: "An error occurred while fetching incentives." });
  }
};

// Create a new incentive
export const createIncentive = async (req: Request, res: Response) => {
  try {
    
    const { amount, incentiveType, beneficiaryType, desc } = req.body;

    // Create a new incentive record
    const newIncentive = await prisma.incentives.create({
      data: {
        amount: Number(amount),
        incentiveType,
        beneficiaryType,
        desc,
      },
    });

    returnMsg(res, newIncentive, "Incentive created successfully.");
  } catch (error) {
    console.error("Error creating incentive:", error);
    res.status(500).json({ message: "An error occurred while creating the incentive." });
  }
};

// Update an incentive
export const updateIncentive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, type, beneficiaryType, description } = req.body;

    const updatedIncentive = await prisma.incentives.update({
      where: { id: Number(id) },
      data: {
        amount: Number(amount),
        type,
        beneficiaryType,
        description,
      },
    });

    returnMsg(res, updatedIncentive, "Incentive updated successfully.");
  } catch (error) {
    console.error("Error updating incentive:", error);
    res.status(500).json({ message: "An error occurred while updating the incentive." });
  }
};

// Delete an incentive
export const deleteIncentive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedIncentive = await prisma.incentives.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedIncentive, "Incentive deleted successfully.");
  } catch (error) {
    console.error("Error deleting incentive:", error);
    res.status(500).json({ message: "An error occurred while deleting the incentive." });
  }
};



export enum EIncentiveType {
    full = 'full',
    limited = 'limited',
    screeningIncentive = 'screeningIncentive',
    clientIncentive = 'clientIncentive'
}

export class RewardService{
    async clientReward(clientNumber: string) {
        const client = await prisma.screening.findUnique({
            where: {
                phoneNumber: clientNumber
            }
        })
        if(!client) return false;
        const reward: number = await this.getIncentive(EIncentiveType["clientIncentive"])
        if (!reward) return false
        const isSent = await this.airtimeReward(clientNumber);
        if (!isSent) return false 
        return true;
    }

    async screeningReward(ppmvNumber: string){
        const ppmv = await prisma.ppmvAgent.findUnique({
            where: {
                phoneNumber: ppmvNumber
            }
        })
        if(!ppmv) return false;
        const reward: number = await this.getIncentive(EIncentiveType["screeningIncentive"])
        if (!reward) return false

        const newBalance = ppmv.activeIncentiveBalance + reward;

        const isUpdatePpmvBalance = await prisma.ppmvAgent.update({
            where: {
                phoneNumber: ppmvNumber
            },
            data: {
                activeIncentiveBalance: newBalance
            }
        })
        if (!isUpdatePpmvBalance) return false 

        // update screening 
        return true;
    }

    screeningConfirmationReward(ppmvNumber: string){

    }

    async airtimeReward(phoneNUmber: string){
        console.log("send airtime to client phone number", phoneNUmber);
        return true; // if successfull
    }

    async getIncentive(incentiveType: EIncentiveType){
        return await prisma.incentive.findUnique({
            where:{
                incentiveType: incentiveType
            }
        })
    }
   
}

class RewardNotification {
    notifyUserByEmail(){

    }

    notifyUserBySms(){

    }
}