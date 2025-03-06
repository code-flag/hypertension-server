import { Router } from "express";
import asyncWrapper from "./../middleware/asyncWrapper";
import {getAllPpmvs, getPPMVByCode  } from "../controller/ppmv.controller";

const PpmvRouter: any = Router();

PpmvRouter.get("/all", asyncWrapper(getAllPpmvs));
PpmvRouter.get("/one/:id", asyncWrapper(getPPMVByCode));


export default PpmvRouter;
