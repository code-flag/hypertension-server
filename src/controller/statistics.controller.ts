import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

export const dashboardStats = async (req: Request, res: Response) =>{
    const result: any = Promise.all([
        await prisma.facilityAgent.count(),
        await prisma.ppmvAgent.count(),
        await prisma.screening.count(),
        await prisma.transactions.count(),
        await prisma.staff.count(),
    ]);

   return returnMsg(res, result, "data retrieved successfully");
}