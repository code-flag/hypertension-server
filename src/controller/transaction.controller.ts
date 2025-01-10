import { Request, Response } from "express";
import { prisma } from "../config/database";
import { returnMsg } from "../helper/message-handler";

// Get all transactions with pagination
export const getAllTransactions = async (req: Request, res: Response) => {
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

    const transactions = await prisma.transactions.findMany({
      ...matchQuery,
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        id: 'asc',
      },
    });

    const totalTransactions = await prisma.transactions.count({
      where: query,
    });

    returnMsg(res, {
      data: transactions,
      total: totalTransactions,
      totalPages: Math.ceil(totalTransactions / Number(limit)),
      currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
    }, "Transactions retrieved successfully.");
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "An error occurred while fetching transactions." });
  }
};

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { ppmvId, clientId, amount, type, status, date } = req.body;

    const newTransaction = await prisma.transactions.create({
      data: {
        ppmvId: Number(ppmvId),
        clientId: Number(clientId),
        amount: Number(amount),
        type,
        status,
        date: new Date(date),
      },
    });

    returnMsg(res, newTransaction, "Transaction created successfully.");
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "An error occurred while creating the transaction." });
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ppmvId, clientId, amount, type, status, date } = req.body;

    const updatedTransaction = await prisma.transactions.update({
      where: { id: Number(id) },
      data: {
        ppmvId: Number(ppmvId),
        clientId: Number(clientId),
        amount: Number(amount),
        type,
        status,
        date: new Date(date),
      },
    });

    returnMsg(res, updatedTransaction, "Transaction updated successfully.");
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "An error occurred while updating the transaction." });
  }
};


// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const deletedTransaction = await prisma.transactions.delete({
        where: { id: Number(id) },
      });
  
      returnMsg(res, deletedTransaction, "Transaction deleted successfully.");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "An error occurred while deleting the transaction." });
    }
  };