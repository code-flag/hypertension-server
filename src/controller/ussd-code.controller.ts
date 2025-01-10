import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

// Get all USSD codes with pagination
export const getAllUssdCodes = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, code } = req.query;

    const query: any = {};
    if (code) {
      query['code'] = code;
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const ussdCodes = await prisma.ussdCode.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalUssdCodes = await prisma.ussdCode.count({
      where: query,
    });

    returnMsg(res, {
      data: ussdCodes,
      total: totalUssdCodes,
      totalPages: Math.ceil(totalUssdCodes / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "USSD codes retrieved successfully.");
  } catch (error) {
    console.error("Error fetching USSD codes:", error);
    res.status(500).json({ message: "An error occurred while fetching USSD codes." });
  }
};

// Create a new USSD code
export const createUssdCode = async (req: Request, res: Response) => {
  try {
    const { code, description } = req.body;

    const newUssdCode = await prisma.ussdCode.create({
      data: {
        code,
        description,
      },
    });

    returnMsg(res, newUssdCode, "USSD code created successfully.");
  } catch (error) {
    console.error("Error creating USSD code:", error);
    res.status(500).json({ message: "An error occurred while creating the USSD code." });
  }
};

// Update a USSD code
export const updateUssdCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, description } = req.body;

    const updatedUssdCode = await prisma.ussdCode.update({
      where: { id: Number(id) },
      data: {
        code,
        description,
      },
    });

    returnMsg(res, updatedUssdCode, "USSD code updated successfully.");
  } catch (error) {
    console.error("Error updating USSD code:", error);
    res.status(500).json({ message: "An error occurred while updating the USSD code." });
  }
};

// Delete a USSD code
export const deleteUssdCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUssdCode = await prisma.ussdCode.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedUssdCode, "USSD code deleted successfully.");
  } catch (error) {
    console.error("Error deleting USSD code:", error);
    res.status(500).json({ message: "An error occurred while deleting the USSD code." });
  }
};
