import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { deletePayment, getAllPayments } from "../controller/payment.controller";

const PaymentRouter: any = Router();

PaymentRouter.get("/all", asyncWrapper(getAllPayments));

export default PaymentRouter;
