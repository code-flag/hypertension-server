import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { getDashboardData } from "../controller/statistics.controller";


const StatisticsRouter: any = Router();

StatisticsRouter.get("/total-count", asyncWrapper(getDashboardData));

export default StatisticsRouter;