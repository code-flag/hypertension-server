import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { dashboardStats } from "../controller/statistics.controller";


const StatisticsRouter: any = Router();

StatisticsRouter.get("/total-count", asyncWrapper(dashboardStats));

export default StatisticsRouter;