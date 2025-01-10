import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";
import { BadRequestError } from '../helper/error';


// Create a new PPMV
export const createPpmv = async (req: Request, res: Response) => {
  try {
    const { name,phoneNumber, age, gender, address, state, lga, location, email } = req.body;
    // Check required fields
if (!name || !phoneNumber || !age || !gender || !address || !state || !lga || !location || !email) {
  return res.status(400).json({ error: "All fields are required" });
}

// Validate gender
if (!["male", "female"].includes(gender)) {
  return res.status(400).json({ error: "Invalid gender value" });
}

    const newPpmv = await prisma.ppmvAgent.create({
      data: {
        name,
        phoneNumber,
        age,
        gender,
        address,
        state,
        lga,
        location,
        email
      },
    });

    returnMsg(res, newPpmv, "PPMV created successfully.");
  } catch (error: any) {
    console.error("Error creating PPMV:", error.message);
    res.status(500).json({ message: "An error occurred while creating the PPMV." });
  }
};

// Update a PPMV
export const updatePpmv = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedPpmv = await prisma.ppmvAgent.update({
      where: { id: Number(id) },
      data: req.body,
    });

    returnMsg(res, updatedPpmv, "PPMV updated successfully.");
  } catch (error) {
    console.error("Error updating PPMV:", error);
    res.status(500).json({ message: "An error occurred while updating the PPMV." });
  }
};

// Update the PPMV incentive balance
export const updatePpmvIncentiveBalance = async (req: Request, res: Response) => {
  try {
    const { ppmvId } = req.params;
    const { amount } = req.body;

    const ppmv = await prisma.ppmvAgent.findUnique({
      where: { id: Number(ppmvId) },
    });

    if (!ppmv) {
      return res.status(404).json({ message: "PPMV not found." });
    }

    // Update the PPMV incentive balance
    const updatedPpmv = await prisma.ppmvAgent.update({
      where: { id: Number(ppmvId) },
      data: {
        currentIncentiveBalance: ppmv.currentIncentiveBalance + Number(amount),
      },
    });

    returnMsg(res, updatedPpmv, "PPMV incentive balance updated successfully.");
  } catch (error) {
    console.error("Error updating PPMV incentive balance:", error);
    res.status(500).json({ message: "An error occurred while updating PPMV incentive balance." });
  }
};

// Process incentive payment to PPMV at month-end
export const processPpmvIncentivePayment = async (req: Request, res: Response) => {
  try {
    const { ppmvId } = req.params;

    const ppmv = await prisma.ppmvAgent.findUnique({
      where: { id: Number(ppmvId) },
    });

    if (!ppmv) {
      return res.status(404).json({ message: "PPMV not found." });
    }

    // Process payment by adding the total incentive to the PPMV's total received incentive
    const updatedPpmv = await prisma.ppmvAgent.update({
      where: { id: Number(ppmvId) },
      data: {
        totalIncentiveReceived: ppmv.totalIncentiveReceived + ppmv.currentIncentiveBalance,
        currentIncentiveBalance: 0,  // Reset current balance after payment
      },
    });

    returnMsg(res, updatedPpmv, "PPMV incentive payment processed successfully.");
  } catch (error) {
    console.error("Error processing PPMV incentive payment:", error);
    res.status(500).json({ message: "An error occurred while processing PPMV incentive payment." });
  }
};


// Get all PPMVs with pagination
export const getAllPpmvs = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, status, ppmvCode } = req.query;

    const query: any = {};
    if (status) {
      query['status'] = status;
    }
    if (ppmvCode) {
      query['ppmvCode'] = ppmvCode;
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const ppmvs = await prisma.ppmvAgent.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalPpmvs = await prisma.ppmvAgent.count({
      where: query,
    });

    returnMsg(res, {
      data: ppmvs,
      total: totalPpmvs,
      totalPages: Math.ceil(totalPpmvs / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "PPMVs retrieved successfully.");
  } catch (error) {
    console.error("Error fetching PPMVs:", error);
    throw new BadRequestError("An error occurred while fetching PPMVs.")
  }
};

// Delete a PPMV
export const deletePpmv = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedPpmv = await prisma.ppmvAgent.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedPpmv, "PPMV deleted successfully.");
  } catch (error) {
    console.error("Error deleting PPMV:", error);
    res.status(500).json({ message: "An error occurred while deleting the PPMV." });
  }
};
