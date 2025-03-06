import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { getScreeningChart } from "../controller/screening.controller";
import { handleUSSDRequest } from "../controller/ussd-service.controller";


const ScreeningRequestRouter: any = Router();

ScreeningRequestRouter.post("/", asyncWrapper(handleUSSDRequest));

export default ScreeningRequestRouter;