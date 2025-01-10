import { Router } from "express";
import StaffRouter from "./staff.routes";
import RoleRouter from "./role.routes";
import FeatureRouter from "./feature.routes";
import RolePermissionRouter from "./role-permission.routes";
import PpmvRouter from "./ppmv.routes";
import UssdCodeRouter from "./ussd-code.routes";
import TransactionRouter from "./transactions.routes";
import IncentiveRouter from "./incentive.routes";
import Facility from "./facility.routes";
import FacilityAgent from "./facility-agent.routes";
import FeatureActionRouter from "./feature-action.routes";
import StatisticsRouter from "./statistics.routes";
import ScreeningRouter from "./screening.routes";


const router: any = Router();

router.use("/staff", StaffRouter);
router.use("/role", RoleRouter);
router.use("/role-permission", RolePermissionRouter);
router.use("/ppmv", PpmvRouter);
router.use("/ussd-code", UssdCodeRouter);
router.use("/transaction", TransactionRouter);
router.use("/incentive", IncentiveRouter);
router.use("/facility-agent", FacilityAgent);
router.use("/facility", Facility);
router.use("/feature-action", FeatureActionRouter);
router.use("/feature", FeatureRouter);
router.use("/statistic", StatisticsRouter)
router.use("/screening", ScreeningRouter)


export default router;