import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";
import { BadRequestError } from "../helper/error";



// Create a new Facility Agent
export const createFacilityAgent = async (req: Request, res: Response) => {
  try {
    const { name, facilityCode, phoneNumber, gender, email, age } = req.body;

    const newFacilityAgent = await prisma.facilityAgent.create({
      data: {
        name,
        phoneNumber,
        facilityCode,
        age,
        gender,
        email
      },
    });

    returnMsg(res, newFacilityAgent, "Facility Agent created successfully.");
  } catch (error) {
    console.error("Error creating Facility Agent:", error);
    res.status(500).json({ message: "An error occurred while creating the Facility Agent." });
  }
};

// Get all Facility Agents with pagination
export const getAllFacilityAgents = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, state, lga } = req.query;

    const query: any = {};
    if (state) {
      query["state"] = state;
    }
    if (lga) {
      query["lga"] = lga;
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const facilityAgents = await prisma.facilityAgent.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalFacilityAgents = await prisma.facilityAgent.count({
      where: query,
    });

    returnMsg(res, {
      data: facilityAgents,
      total: totalFacilityAgents,
      totalPages: Math.ceil(totalFacilityAgents / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Facility agents retrieved successfully.");
  } catch (error) {
    console.error("Error fetching Facility Agents:", error);
    throw new BadRequestError("An error occurred while fetching Facility Agents.");
  }
};

// Update a Facility Agent
export const updateFacilityAgent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, facilityName, address, state, lga, email, location } = req.body;

    const updatedFacilityAgent = await prisma.facilityAgent.update({
      where: { id: Number(id) },
      data: {
        name,
        facilityName,
        address,
        state,
        lga,
        email,
        location,
      },
    });

    returnMsg(res, updatedFacilityAgent, "Facility Agent updated successfully.");
  } catch (error) {
    console.error("Error updating Facility Agent:", error);
    res.status(500).json({ message: "An error occurred while updating the Facility Agent." });
  }
};

// Delete a Facility Agent
export const deleteFacilityAgent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedFacilityAgent = await prisma.facilityAgent.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedFacilityAgent, "Facility Agent deleted successfully.");
  } catch (error) {
    console.error("Error deleting Facility Agent:", error);
    res.status(500).json({ message: "An error occurred while deleting the Facility Agent." });
  }
};
