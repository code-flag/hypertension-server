import { Router } from "express";
import asyncWrapper from "./../middleware/asyncWrapper";
import { createRole, deleteRole, getAllRoles, updateRole,  } from "../controller/role.controller";

const RoleRouter: any = Router();

RoleRouter.post("/create", asyncWrapper(createRole));
RoleRouter.get("/all", asyncWrapper(getAllRoles));
// RoleRouter.get("/:id", asyncWrapper(getRoleByID));
RoleRouter.put("/update/:id", asyncWrapper(updateRole));
RoleRouter.delete("/delete/:id", asyncWrapper(deleteRole));

export default RoleRouter;
