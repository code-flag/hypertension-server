import { Router } from "express";
import asyncWrapper from "./../middleware/asyncWrapper";
import { createPpmv, deletePpmv, getAllPpmvs, updatePpmv, updatePpmvIncentiveBalance, processPpmvIncentivePayment  } from "../controller/ppmv.controller";

const PpmvRouter: any = Router();

PpmvRouter.post("/create", asyncWrapper(createPpmv));
PpmvRouter.get("/all", asyncWrapper(getAllPpmvs));
// PpmvRouter.get("/:id", asyncWrapper(getPpmvB));
PpmvRouter.put("/update/:id", asyncWrapper(updatePpmv));
PpmvRouter.delete("/delete/:id", asyncWrapper(deletePpmv));
PpmvRouter.put("/update/balance/:ppmvId", asyncWrapper(updatePpmvIncentiveBalance));
PpmvRouter.put("/process/payment/:ppmvId", asyncWrapper(processPpmvIncentivePayment));

export default PpmvRouter;
