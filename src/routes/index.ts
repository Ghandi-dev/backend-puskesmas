import authRoute from "./auth.route";
import roomRoute from "./room.route";
import inventoryRoute from "./inventory.route";
import mediaRoute from "./media.route";

const router = require("express").Router();

router.use(authRoute);
router.use(roomRoute);
router.use(inventoryRoute);
router.use(mediaRoute);

export default router;
