import { Router } from "express";
import asyncWrapper from "./../middleware/asyncWrapper";
import { createUssdCode, deleteUssdCode, getAllUssdCodes, updateUssdCode } from "../controller/ussd-code.controller";

const UssdCodeRouter: any = Router();

UssdCodeRouter.post("/create", asyncWrapper(createUssdCode));
UssdCodeRouter.get("/all", asyncWrapper(getAllUssdCodes));
// UssdCodeRouter.get("/:id", asyncWrapper(getUssdCodeByID));
UssdCodeRouter.put("/update/:id", asyncWrapper(updateUssdCode));
UssdCodeRouter.delete("/delete/:id", asyncWrapper(deleteUssdCode));

export default UssdCodeRouter;
