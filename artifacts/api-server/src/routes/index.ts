import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aquaRouter from "./aqua";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aquaRouter);

export default router;
