import express from "express";
import * as inventoryController from "../controllers/inventory.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.post("/inventory",[authMiddleware, aclMiddleware([ROLES.ADMIN])], inventoryController.create);
router.get("/inventories", inventoryController.getAll);
router.get("/inventory/:id", inventoryController.getById);
router.delete("/inventory/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], inventoryController.remove);
router.put("/inventory/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], inventoryController.update);

export default router;