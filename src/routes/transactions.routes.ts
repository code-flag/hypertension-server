import { Router } from "express";
import asyncWrapper from "./../middleware/asyncWrapper";
import { createTransaction, deleteTransaction, getAllTransactions } from "../controller/transaction.controller";

const TransactionRouter: any = Router();

TransactionRouter.post("/create", asyncWrapper(createTransaction));
TransactionRouter.get("/all", asyncWrapper(getAllTransactions));
// TransactionRouter.get("/:id", asyncWrapper(getTransactionByID));
// TransactionRouter.put("/update/:id", asyncWrapper(updateTransactionInfo));
TransactionRouter.delete("/delete/:id", asyncWrapper(deleteTransaction));

export default TransactionRouter;
