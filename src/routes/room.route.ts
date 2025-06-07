import express from "express";
import * as roomController from "../controllers/room.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constant";
import aclMiddleware from "../middlewares/acl.middleware";

const router = express.Router();

router.post("/room", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], roomController.create);
router.get("/room", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], roomController.getAll);
router.get("/room/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], roomController.getById);
router.put("/room/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], roomController.update);
router.delete("/room/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], roomController.remove);

export default router;
