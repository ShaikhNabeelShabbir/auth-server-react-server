"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
//importing fuctions
const authController_1 = require("./authController");
const authMiddleware_1 = require("./authMiddleware"); // Adjust the path as needed
const authRoutes = new hono_1.Hono();
//defining the auth routes with the respective auth functions
authRoutes.use("/tokens/*", authMiddleware_1.authMiddleware);
authRoutes.post("/signup", authController_1.handleSignUp);
authRoutes.post("/signin", authController_1.handleSignIn);
authRoutes.post("/reset-password", authController_1.handleResetPassword);
authRoutes.get("/tokens", authMiddleware_1.authMiddleware, authController_1.handleGetTokens);
authRoutes.post("/tokens", authMiddleware_1.authMiddleware, authController_1.handleCreateToken);
authRoutes.patch("/tokens/:id", authMiddleware_1.authMiddleware, authController_1.handleUpdateToken);
authRoutes.delete("/tokens/:id", authMiddleware_1.authMiddleware, authController_1.handleDeleteToken);
authRoutes.post("/single-token", authMiddleware_1.authMiddleware, authController_1.handleGetSingularTokens);
exports.default = authRoutes;
