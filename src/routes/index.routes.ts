import { Router } from "express";
import PpmvRouter from "./ppmv.routes";
import UssdCodeRouter from "./ussd-code.routes";
import PaymentRouter from "./payment.routes";
import IncentiveRouter from "./incentive.routes";
import StatisticsRouter from "./statistics.routes";
import ScreeningRouter from "./screening.routes";
import ScreeningRequestRouter from "./screening-request.routes";


const router: any = Router();

router.use("/ppmv", PpmvRouter);
router.use("/ussd-code", UssdCodeRouter);
router.use("/reward", PaymentRouter);
router.use("/incentive", IncentiveRouter);
router.use("/statistic", StatisticsRouter)
router.use("/screening", ScreeningRouter)
router.use("/ussd-request", ScreeningRequestRouter)


export default router;