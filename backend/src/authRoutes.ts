import { Hono } from "hono";
//importing fuctions
import {
  handleSignUp,
  handleSignIn,
  handleResetPassword,
  handleGetTokens,
  handleDeleteToken,
  handleUpdateToken,
  handleCreateToken,
  handleGetSingularTokens,
} from "./authController";
import { authMiddleware } from "./authMiddleware"; // Adjust the path as needed

const authRoutes = new Hono();

//defining the auth routes with the respective auth functions
authRoutes.use("/tokens/*", authMiddleware);

authRoutes.post("/signup", handleSignUp);
authRoutes.post("/signin", handleSignIn);
authRoutes.post("/reset-password", handleResetPassword);

authRoutes.get("/tokens", authMiddleware, handleGetTokens);
authRoutes.post("/tokens", authMiddleware, handleCreateToken);
authRoutes.patch("/tokens/:id", authMiddleware, handleUpdateToken);
authRoutes.delete("/tokens/:id", authMiddleware, handleDeleteToken);

authRoutes.post("/single-token", authMiddleware, handleGetSingularTokens);

export default authRoutes;
