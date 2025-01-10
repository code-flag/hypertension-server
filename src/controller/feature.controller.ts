import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

// Create a new feature
export const createFeature = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    const newFeature = await prisma.features.create({
      data: {
        title,
      },
    });

    returnMsg(res, newFeature, "Feature created successfully.");
  } catch (error) {
    console.error("Error creating feature:", error);
    res.status(500).json({ message: "An error occurred while creating the feature." });
  }
};

// Update a feature
export const updateFeature = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedFeature = await prisma.features.update({
      where: { id: Number(id) },
      data: {
        title,
      },
    });

    returnMsg(res, updatedFeature, "Feature updated successfully.");
  } catch (error) {
    console.error("Error updating feature:", error);
    res.status(500).json({ message: "An error occurred while updating the feature." });
  }
};

// Get all features with pagination
export const getAllFeatures = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, title } = req.query;

    const query: any = {};
    if (title) {
      query['title'] = title;
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const features = await prisma.features.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalFeatures = await prisma.features.count({
      where: query,
    });

    returnMsg(res, {
      data: features,
      total: totalFeatures,
      totalPages: Math.ceil(totalFeatures / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Features retrieved successfully.");
  } catch (error) {
    console.error("Error fetching features:", error);
    res.status(500).json({ message: "An error occurred while fetching features." });
  }
};

// Delete a feature
export const deleteFeature = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedFeature = await prisma.features.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedFeature, "Feature deleted successfully.");
  } catch (error) {
    console.error("Error deleting feature:", error);
    res.status(500).json({ message: "An error occurred while deleting the feature." });
  }
};
