import express from "express";
import * as authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

// Auth
/**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
        required: true,
        schema: {
          $ref:"#/components/schemas/RegisterRequest"
        }
     }
     */
router.post("/auth/register", authController.register);

/**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
        required: true,
        schema: {
          $ref:"#/components/schemas/LoginRequest"
        }
     }
     */
router.post("/auth/login", authController.login);

/**
     #swagger.tags = ['Auth']
     #swagger.security = [{ 
     "bearerAuth": [] 
     }]
     */
router.get("/auth/me", authMiddleware, authController.me);

/**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
        required: true,
        schema: {
          $ref:"#/components/schemas/ActivationRequest"
        }
     }
     */
// router.post("/auth/activation", authController.activation);

/**
     #swagger.tags = ['Auth']
     #swagger.security = [{ 
     "bearerAuth": [] 
     }]
     #swagger.requestBody = {
        required: true,
        schema: {
          $ref:"#/components/schemas/UpdateProfileRequest"
        }
     }
     */
router.put("/auth/update-profile", [authMiddleware, aclMiddleware([ROLES.MEMBER])], authController.updateProfile);

/**
     #swagger.tags = ['Auth']
     #swagger.security = [{ 
     "bearerAuth": [] 
     }]
     #swagger.requestBody = {
        required: true,
        schema: {
          $ref:"#/components/schemas/UpdatePasswordRequest"
        }
     }
     */
router.put("/auth/update-password", [authMiddleware, aclMiddleware([ROLES.MEMBER])], authController.updatePassword);

export default router;
