import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

// Get all roles with pagination
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, title } = req.query;
    
    const query: any = {};
    if (title) {
      query['title'] = title;
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const roles = await prisma.role.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalRoles = await prisma.role.count({
      where: query,
    });

    returnMsg(res, {
      data: roles,
      total: totalRoles,
      totalPages: Math.ceil(totalRoles / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Roles retrieved successfully.");
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "An error occurred while fetching roles." });
  }
};

// Create a new role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    const newRole = await prisma.role.create({
      data: {
        title,
      },
    });

    returnMsg(res, newRole, "Role created successfully.");
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "An error occurred while creating the role." });
  }
};

// Update a role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedRole = await prisma.role.update({
      where: { id: Number(id) },
      data: {
        title,
      },
    });

    returnMsg(res, updatedRole, "Role updated successfully.");
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "An error occurred while updating the role." });
  }
};

// Delete a role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedRole = await prisma.role.delete({
      where: { id: Number(id) },
    });

    returnMsg(res, deletedRole, "Role deleted successfully.");
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "An error occurred while deleting the role." });
  }
};
