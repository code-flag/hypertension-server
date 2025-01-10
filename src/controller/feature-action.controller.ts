import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";


// Create a new feature
export const createFeatureAction = async (req: Request, res: Response) => {
  try {
    const { featureId, id, action} = req.body;

    const isFeatureActionExist: any = await prisma.featureAction.findUnique({where: {featureId: featureId}});
    console.log("isFeatureActionExist ", isFeatureActionExist);
    let newFeature: any;
    if (isFeatureActionExist) {
      newFeature = await prisma.featureAction.create({
        data: {featureId, actions: [{id, action}]}
      });
    }
    else {
      isFeatureActionExist.actions.push({id, action})
      let actions = isFeatureActionExist.actions;
      newFeature = await prisma.featureAction.update({
        data: {featureId, actions: actions}
      });
    }
   
    returnMsg(res, newFeature, "Feature action created successfully.");
  } catch (error) {
    console.error("Error creating feature:", error);
    res.status(500).json({ message: "An error occurred while creating the feature." });
  }
};

// Update a feature
export const updateFeatureAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { actions } = req.body;

    const updatedFeature = await prisma.featureAction.update({
      where: { id: Number(id) },
      data: {
        actions,
      },
    });

    returnMsg(res, updatedFeature, "Feature action updated successfully.");
  } catch (error) {
    console.error("Error updating feature:", error);
    res.status(500).json({ message: "An error occurred while updating the feature." });
  }
};
// Get all featuresAction with pagination
export const getAllFeaturesAction = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, title } = req.query;

    const query: any = {};
    if (title) {
      query['title'] = title;
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const featuresAction = await prisma.featureAction.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalFeaturesAction = await prisma.featureAction.count({
      where: query,
    });

    returnMsg(res, {
      data: featuresAction,
      total: totalFeaturesAction,
      totalPages: Math.ceil(totalFeaturesAction / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Features Action retrieved successfully.");
  } catch (error) {
    console.error("Error fetching featuresAction:", error);
    res.status(500).json({ message: "An error occurred while fetching featuresAction." });
  }
};

// Delete a feature
export const deleteFeatureAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedFeature = await prisma.featureAction.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedFeature, "Feature action deleted successfully.");
  } catch (error) {
    console.error("Error deleting feature:", error);
    res.status(500).json({ message: "An error occurred while deleting the feature." });
  }
};
