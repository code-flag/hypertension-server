import { Router } from "express";
import asyncWrapper from "./../middleware/asyncWrapper";
import { createIncentive, deleteIncentive, getAllIncentives, updateIncentive} from "../controller/incentive.controller";

const IncentiveRouter: any = Router();

IncentiveRouter.post("/create", asyncWrapper(createIncentive));
IncentiveRouter.get("/all", asyncWrapper(getAllIncentives));
IncentiveRouter.put("/update/:id", asyncWrapper(updateIncentive));
IncentiveRouter.delete("/delete/:id", asyncWrapper(deleteIncentive));

export default IncentiveRouter;
