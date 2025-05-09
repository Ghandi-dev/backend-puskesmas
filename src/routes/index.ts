import authRoute from "./auth.route";

const router = require("express").Router();

router.use(authRoute);

export default router;
