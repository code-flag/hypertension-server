import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";


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

    const matchQuery = Object.keys(query).length > 0 ? query : {};

    const incentives = await prisma.incentives.findMany( matchQuery,{
      limit: Number(limit),
      offset: Number(offset),
      sort: {
        id: 'asc',
      },
    });

    returnMsg(res, incentives, "Incentives retrieved successfully.");
  } catch (error) {
    console.error("Error fetching incentives:", error);
    res.status(500).json({ message: "An error occurred while fetching incentives." });
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

    async screeningReward(ppmvCode: string){
        const ppmv = await prisma.ppmvAgent.findUnique({
            where: {
                ppmvCode: ppmvCode
            }
        })

        if(!ppmv) return false;

        let reward: any;
        try {
          reward = await this.getIncentive(EIncentiveType["screeningIncentive"])

        } catch (error) {
          console.log("error incent", error);
        }
        if (!reward) return false

        const newBalance: number = Number(ppmv?.activeIncentiveBalance) + Number(reward?.amount);

        let isUpdatePpmvBalance: any;
    try {
       isUpdatePpmvBalance = await prisma.ppmvAgent.update({
        where: {
            ppmvCode: ppmvCode
        },
        data: {
            activeIncentiveBalance: newBalance
        }
    })
    } catch (error) {
      console.log("errpr ", error)
    }

        console.log("after update")
        if (!isUpdatePpmvBalance) return false 

        // update screening 
        return true;
    }



    async elevatedScreeningReward(ppmvCode: string){
      const ppmv = await prisma.ppmvAgent.findUnique({
          where: {
              ppmvCode: ppmvCode
          }
      })

      if(!ppmv) return false;

      let reward: any;
      try {
        reward = await this.getIncentive(EIncentiveType["full"])

      } catch (error) {
        console.log("error incent", error);
      }
      if (!reward) return false

      const newBalance: number = Number(ppmv?.activeIncentiveBalance) + Number(reward?.amount);

      let isUpdatePpmvBalance: any;
  try {
     isUpdatePpmvBalance = await prisma.ppmvAgent.update({
      where: {
          ppmvCode: ppmvCode
      },
      data: {
          activeIncentiveBalance: newBalance
      }
  })
  } catch (error) {
    console.log("errpr ", error)
  }

      console.log("after update")
      if (!isUpdatePpmvBalance) return false 

      // update screening 
      return true;
  }

    async refererReward(ppmvCode: string){
      const ppmv = await prisma.ppmvAgent.findUnique({
          where: {
              ppmvCode: ppmvCode
          }
      })

      if(!ppmv) return false;

      let reward: any;
      try {
        reward = await this.getIncentive(EIncentiveType["limited"])

      } catch (error) {
        console.log("error incent", error);
      }
      if (!reward) return false

      const newBalance: number = Number(ppmv?.activeIncentiveBalance) + Number(reward?.amount);

      let isUpdatePpmvBalance: any;
  try {
     isUpdatePpmvBalance = await prisma.ppmvAgent.update({
      where: {
          ppmvCode: ppmvCode
      },
      data: {
          activeIncentiveBalance: newBalance
      }
  })
  } catch (error) {
    console.log("errpr ", error)
  }

      console.log("after update")
      if (!isUpdatePpmvBalance) return false 

      // update screening 
      return true;
  }

    async airtimeReward(phoneNUmber: string){
        console.log("send airtime to client phone number", phoneNUmber);
        return true; // if successfull
    }

    async getIncentive(incentiveType: EIncentiveType){
        return await prisma.incentives.findFirst({
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