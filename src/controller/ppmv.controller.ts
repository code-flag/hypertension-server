import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";
import { BadRequestError, ServerError } from '../helper/error';

// Get all PPMVs with pagination
export const getAllPpmvs = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, status, ppmvCode } = req.query;

    const query: any = {
      where: {}
    };
    if (status) {
      query['status'] = status;
    }
    if (ppmvCode) {
      query['ppmvCode'] = ppmvCode;
    }

    const matchQuery = Object.keys(query).length > 0 ? query  : {};

    const ppmvs = await prisma.ppmvAgent.paginate(  matchQuery,{
      limit: Number(limit),
      offset: Number(offset),
      sort: {
        id: 'asc',
      },
    });

    returnMsg(res, ppmvs, "PPMVs retrieved successfully.");
  } catch (error) {
    console.error("Error fetching PPMVs:", error);
    throw new BadRequestError("An error occurred while fetching PPMVs.")
  }
};

export const getPPMVByCode = async (req: any, res: any) => {
  const {code } = req.params;

 const result: any =  await prisma.ppmvAgent.findFirst({
    where: {
      ppmvCode: code
    }
  })
  returnMsg(res, result, "PPMV data retrieved successfully");
}
