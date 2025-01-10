import { Request, Response } from "express";
import { prisma } from './../config/database';
import { returnMsg } from './../helper/message-handler';
import { BadRequestError, NotFoundError } from "../helper/error";

// Create a new staff member
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, designation, roleId, accessLevel } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !roleId) {
      throw new BadRequestError("Missing required fields: name, email, phoneNumber, roleId.");
    }

    // Check if the staff member already exists based on email or phone number
    const existingStaff = await prisma.staff.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber },
        ],
      },
    });

    if (existingStaff) {
      throw new BadRequestError("Staff member with this email or phone number already exists.");
    }

    // Create the staff member
    const newStaff = await prisma.staff.create({
      data: {
        name,
        email,
        phoneNumber,
        designation,
        roleId,
        accessLevel,
      },
    });

    return returnMsg(res, newStaff, "Staff member created successfully.");
  } catch (error: any) {
    console.error("Error creating staff:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while creating the staff member.",
    });
  }
};

// Update a staff member by ID
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, designation, roleId, accessLevel } = req.body;

    // Find the staff member by ID
    const staff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
    });

    if (!staff) {
      throw new NotFoundError("Staff member not found.");
    }

    // Update the staff member
    const updatedStaff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phoneNumber,
        designation,
        roleId,
        accessLevel,
      },
    });

    return returnMsg(res, updatedStaff, "Staff member updated successfully.");
  } catch (error: any) {
    console.error("Error updating staff:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while updating the staff member.",
    });
  }
};


// Get a single staff member by ID
export const getStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the staff member by ID
    const staff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
      include: {
        role: true, // Include related role data
      },
    });

    if (!staff) {
      throw new NotFoundError("Staff member not found.");
    }

    return returnMsg(res, staff, "Staff member retrieved successfully.");
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while fetching the staff member.",
    });
  }
};


export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, email, id, role } = req.query;

    const query: any = {};
    
    if (id) {
      query['id'] = Number(id); // Ensure it's a number for consistent filtering
    }
    
    if (email) {
      query['email'] = email;
    }
    
    if (role) {
      query['roleId'] = role; // Assuming `roleId` is used in your schema
    }

    // Build the query object
    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    // Use Prisma pagination
    const staffList = await prisma.staff.findMany({
      ...matchQuery,
      take: Number(limit), // Limit the number of records
      skip: Number(offset), // Skip the first `offset` records
      orderBy: {
        id: 'asc', // Sort by id (or another field)
      },
    });

    // Count total number of records for pagination info
    const totalStaff = await prisma.staff.count({
      where: query, // Apply the same filters
    });

    // Return paginated result with total count
    returnMsg(res, {
      data: staffList,
      total: totalStaff,
      totalPages: Math.ceil(totalStaff / Number(limit)), // Calculate total pages
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1, // Calculate current page
    }, "Staff retrieved successfully.");
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while fetching staff.",
    });
  }
};

// Delete a staff member by ID
export const deleteStaff = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Find the staff member by ID
      const staff = await prisma.staff.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!staff) {
        throw new NotFoundError("Staff member not found.");
      }
  
      // Delete the staff member
      await prisma.staff.delete({
        where: { id: parseInt(id) },
      });
  
      return returnMsg(res, null, "Staff member deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      res.status(error.statusCode || 500).json({
        message: error.message || "An error occurred while deleting the staff member.",
      });
    }
  };
  