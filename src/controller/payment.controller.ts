import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";
import { BadRequestError } from "../helper/error";

enum EAuthorizationLevel {
  firstChecker = 1,
  secondChecker = 2,
  thirdChecker = 3,
  fourthChecker = 4,
  authorizer = 5,
}

// Create a new payment
export const processMonthlyPayment = async () => {

};

// Update a payment
export const updatePayment = async (req: any, res: Response) => {
  const {user, project, userProject} = req.user;

  try {
    const { id } = req.params;

    const findProject = await prisma.payment.findUnique({
      where: {
        id: id
      }
    });

    if (!findProject) {
      throw new BadRequestError("Project not found");
    }

    // convert user role to enum number
    let userRoleLevel: number = Number(EAuthorizationLevel[userProject.projectRole]);
    // check current checker level 
    if (findProject.authorizationLevel > userRoleLevel) {
      throw new BadRequestError("You have authorized this payment already")
    }
    // check current checker level 
    let nextLevel = findProject.authorizationLevel + 1;
    if (nextLevel < userRoleLevel && userRoleLevel !== 5) {
      throw new BadRequestError("You can not authorize or check this payment yet")
    }

    if (findProject.authorizedBy) {
      findProject.authorizedBy = [{userId: user.id, name: user.name}];
    }
    
    findProject.authorizedBy.push({userId: user.id, name: user.name});
    
    const updatedPayment = await prisma.payment.update({
      where: { id: id },
      data: {
        authorizationLevel: findProject.authorizationLevel++,
        authorizedBy: findProject.authorizedBy
      },
    });

    returnMsg(res, updatedPayment, "Payment updated successfully.");
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "An error occurred while updating the payment." });
  }
};

// Get all payment with pagination
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0, status, ppmvId, clientId, fromDate } = req.query;

    const query: any = {};
    if (status) {
      query['status'] = status;
    }
    if (ppmvId) {
      query['ppmvId'] = Number(ppmvId);
    }
    if (clientId) {
      query['clientId'] = Number(clientId);
    }
    if (fromDate) {
      query['createdAt'] = new Date();
    }

    const matchQuery = Object.keys(query).length > 0 ? { where: query } : {};

    const payment = await prisma.payment.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalPayments = await prisma.payment.count({
      where: query,
    });

    returnMsg(res, {
      data: payment,
      total: totalPayments,
      totalPages: Math.ceil(totalPayments / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Payments retrieved successfully.");
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "An error occurred while fetching payment." });
  }
};

// Delete a payment
export const deletePayment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const deletedPayment = await prisma.payment.delete({
        where: { id: id },
      });
  
      returnMsg(res, deletedPayment, "Payment deleted successfully.");
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ message: "An error occurred while deleting the payment." });
    }
  };