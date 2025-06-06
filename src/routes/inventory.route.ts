import express from "express";
import * as inventoryController from "../controllers/inventory.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.post("/inventory", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], inventoryController.create);
router.get("/inventories", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], inventoryController.getAll);
router.get("/inventory/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], inventoryController.getById);
router.delete("/inventory/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], inventoryController.remove);
router.put("/inventory/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], inventoryController.update);

export default router;
