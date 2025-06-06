import express from "express";

import dasboardController from "../controllers/dasboard.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.get("/dashboard", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], dasboardController.getDashboard);

export default router;
