import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

// Get all role-permission mappings with pagination
export const getAllRolePermissions = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, roleId, featureId } = req.query;

    const query: any = {};
    if (roleId) {
      query['roleId'] = Number(roleId);
    }

    if (featureId) {
      query['featureId'] = Number(featureId);
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const rolePermissions = await prisma.rolePermission.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalRolePermissions = await prisma.rolePermission.count({
      where: query,
    });

    returnMsg(res, {
      data: rolePermissions,
      total: totalRolePermissions,
      totalPages: Math.ceil(totalRolePermissions / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Role permissions retrieved successfully.");
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    res.status(500).json({ message: "An error occurred while fetching role permissions." });
  }
};

// Create a new role-permission mapping
export const createRolePermission = async (req: Request, res: Response) => {
  try {
    const { roleId, featureId } = req.body;

    const newRolePermission = await prisma.rolePermission.create({
      data: {
        roleId: Number(roleId),
        featureId: Number(featureId),
      },
    });

    returnMsg(res, newRolePermission, "Role permission created successfully.");
  } catch (error) {
    console.error("Error creating role permission:", error);
    res.status(500).json({ message: "An error occurred while creating the role permission." });
  }
};

// Delete a role-permission mapping
export const deleteRolePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedRolePermission = await prisma.rolePermission.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedRolePermission, "Role permission deleted successfully.");
  } catch (error) {
    console.error("Error deleting role permission:", error);
    res.status(500).json({ message: "An error occurred while deleting the role permission." });
  }
};
