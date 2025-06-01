import express from "express";
import * as roomController from "../controllers/room.controller";

const router = express.Router();

router.post("/room", roomController.create);
router.get("/rooms", roomController.getAll);
router.get("/room/:id", roomController.getById);
router.put("/room/:id", roomController.update);
router.delete("/room/:id", roomController.remove);

export default router;
