import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { createStaff, deleteStaff, getAllStaff, getStaff, updateStaff } from '../controller/staff.controller';


const StaffRouter: any = Router();

StaffRouter.post("/create", asyncWrapper(createStaff));
StaffRouter.get("/all", asyncWrapper(getAllStaff));
// StaffRouter.get("/one/:email", asyncWrapper(getStaffByEmail));
StaffRouter.get("/:id", asyncWrapper(getStaff));
StaffRouter.put("/update/:id", asyncWrapper(updateStaff));
StaffRouter.delete("/delete/:id", asyncWrapper(deleteStaff));


export default StaffRouter;