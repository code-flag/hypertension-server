import { Router } from "express";
import asyncWrapper from "./../middleware/asyncWrapper";
import { createRolePermission, deleteRolePermission, getAllRolePermissions} from "../controller/role-permission.controller";

const RolePermissionRouter: any = Router();

RolePermissionRouter.post("/create", asyncWrapper(createRolePermission));
RolePermissionRouter.get("/all", asyncWrapper(getAllRolePermissions));
// RolePermissionRouter.get("/:id", asyncWrapper(getRolePermissionById));
RolePermissionRouter.delete("/delete/:id", asyncWrapper(deleteRolePermission));

export default RolePermissionRouter;
