import { Router } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { createFeature, deleteFeature, getAllFeatures, updateFeature} from "../controller/feature.controller";

const FeatureRouter: any = Router();

FeatureRouter.post("/create", asyncWrapper(createFeature));
FeatureRouter.get("/all", asyncWrapper(getAllFeatures));
FeatureRouter.put("/update/:id", asyncWrapper(updateFeature));
FeatureRouter.delete("/delete/:id", asyncWrapper(deleteFeature));

export default FeatureRouter;
