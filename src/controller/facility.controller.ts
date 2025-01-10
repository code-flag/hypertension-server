import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";
import { BadRequestError } from "../helper/error";

// Create a new Facility Agent
export const createFacility = async (req: Request, res: Response) => {
  try {
    const { code, facilityName, address, state, lga, location } = req.body;

    const newFacility = await prisma.facility.create({
      data: {
        code,
        facilityName,
        address,
        state,
        lga,
        location,
      },
    });

    returnMsg(res, newFacility, "Facility Agent created successfully.");
  } catch (error) {
    console.error("Error creating Facility Agent:", error);
    res.status(500).json({ message: "An error occurred while creating the Facility Agent." });
  }
};

// Get all Facility Agents with pagination
export const getAllFacilities = async (req: Request, res: Response) => {
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

    const facilities = await prisma.facility.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalFacilities = await prisma.facility.count({
      where: query,
    });

    returnMsg(res, {
      data: facilities,
      total: totalFacilities,
      totalPages: Math.ceil(totalFacilities / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Facility agents retrieved successfully.");
  } catch (error) {
    console.error("Error fetching Facility Agents:", error);
    throw new BadRequestError("An error occurred while fetching Facility Agents.");
  }
};

// Update a Facility Agent
export const updateFacility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedFacility = await prisma.facility.update({
      where: { id: Number(id) },
      data: req.body,
    });

    returnMsg(res, updatedFacility, "Facility Agent updated successfully.");
  } catch (error) {
    console.error("Error updating Facility Agent:", error);
    res.status(500).json({ message: "An error occurred while updating the Facility Agent." });
  }
};

// Delete a Facility Agent
export const deleteFacility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedFacility = await prisma.facility.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedFacility, "Facility Agent deleted successfully.");
  } catch (error) {
    console.error("Error deleting Facility Agent:", error);
    res.status(500).json({ message: "An error occurred while deleting the Facility Agent." });
  }
};
