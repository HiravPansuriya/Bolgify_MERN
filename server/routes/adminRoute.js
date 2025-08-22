import { Router } from "express";
import { getAdminDashboardData } from "../controllers/adminController.js";
import { restrictTo } from "../middlewares/auth.js";

const router = Router();

router.get("/", restrictTo(["ADMIN"]), getAdminDashboardData);

export default router;
