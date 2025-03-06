import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

// Get all reward with pagination
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, status, recipientCode, recipientPhoneNumber, fromDate, toDate } = req.query;

    const query: any = {};
    if (status) {
      query['status'] = status;
    }
    if (recipientCode) {
      query['recipientCode'] = Number(recipientCode);
    }
    if (recipientPhoneNumber) {
      query['recipientPhoneNumber'] = Number(recipientPhoneNumber);
    }
    if (fromDate) {
      query['createdAt'] = new Date();
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const reward = await prisma.reward.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalTransactions = await prisma.reward.count({
      where: query,
    });

    returnMsg(res, {
      data: reward,
      total: totalTransactions,
      totalPages: Math.ceil(totalTransactions / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Transactions retrieved successfully.");
  } catch (error) {
    console.error("Error fetching reward:", error);
    res.status(500).json({ message: "An error occurred while fetching reward." });
  }
};
