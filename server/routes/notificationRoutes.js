import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { getNotifications, markNotificationRead } from "../controllers/notificationController.js";

const router = Router();

router.get("/", requireAuth, getNotifications);

router.put("/:id/read", requireAuth, markNotificationRead);

export default router;
