import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { aggregateByUserCode, getAllScreenings, getScreeningChart, getScreeningCharts2 } from "../controller/screening.controller";


const ScreeningRouter: any = Router();

ScreeningRouter.get("/chart-data", asyncWrapper(getScreeningChart));
ScreeningRouter.get("/chart-data/v2", asyncWrapper(getScreeningCharts2));
ScreeningRouter.get("/all", asyncWrapper(getAllScreenings));

ScreeningRouter.get("/code-aggregate", asyncWrapper(aggregateByUserCode));


export default ScreeningRouter;