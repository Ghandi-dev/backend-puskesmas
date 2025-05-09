import express from "express";
import * as roomController from "../controllers/room.controller";

const router = express.Router();

router.post("/room", roomController.create);
router.get("/rooms", roomController.getAll);
router.delete("/room/:id", roomController.remove);

export default router;
