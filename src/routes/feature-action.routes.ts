import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { createFeatureAction, deleteFeatureAction, getAllFeaturesAction, updateFeatureAction} from "../controller/feature-action.controller";

const FeatureActionRouter: any = Router();

FeatureActionRouter.post("/create", asyncWrapper(createFeatureAction));
FeatureActionRouter.get("/all", asyncWrapper(getAllFeaturesAction));
FeatureActionRouter.put("/update/:id", asyncWrapper(updateFeatureAction));
FeatureActionRouter.delete("/delete/:id", asyncWrapper(deleteFeatureAction));

export default FeatureActionRouter;
