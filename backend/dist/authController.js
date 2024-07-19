"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetSingularTokens = exports.handleDeleteToken = exports.handleUpdateToken = exports.handleGetTokens = exports.handleCreateToken = exports.handleResetPassword = exports.handleSignIn = exports.handleSignUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("./authService");
const schemas_1 = require("./schemas");
const dotenv_1 = __importDefault(require("dotenv"));
const token_1 = require("./token");
dotenv_1.default.config();
const JWT_SECRET = String(process.env.JWT_SECRET);
// defining the functionality behind signin singup and reset password
const handleSignUp = async (c) => {
    const body = await c.req.json();
    const validation = schemas_1.signUpSchema.safeParse(body);
    if (!validation.success) {
        return c.json({ error: validation.error.errors }, 400);
    }
    const { email, password } = validation.data;
    const token = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    await (0, authService_1.signUp)(email, password, token);
    return c.json({ message: "User created successfully", token });
};
exports.handleSignUp = handleSignUp;
const handleSignIn = async (c) => {
    const body = await c.req.json();
    const validation = schemas_1.signInSchema.safeParse(body);
    if (!validation.success) {
        return c.json({ error: validation.error.errors }, 400);
    }
    const { email, password } = validation.data;
    try {
        const token = await (0, authService_1.signIn)(email, password);
        return c.json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            return c.json({ error: "Invalid email or password" }, 401);
        }
        else {
            return c.json({ error: "An unexpected error occurred" }, 500);
        }
    }
};
exports.handleSignIn = handleSignIn;
const handleResetPassword = async (c) => {
    const body = await c.req.json();
    const validation = schemas_1.resetPasswordSchema.safeParse(body);
    if (!validation.success) {
        return c.json({ error: validation.error.errors }, 400);
    }
    const { email, newPassword } = validation.data;
    try {
        await (0, authService_1.resetPassword)(email, newPassword);
        return c.json({ message: "Password reset successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return c.json({ error: error.message }, 400);
        }
        else {
            return c.json({ error: "An unexpected error occurred" }, 500);
        }
    }
};
exports.handleResetPassword = handleResetPassword;
const handleCreateToken = async (c) => {
    const body = await c.req.json();
    const email = c.get("email");
    const validation = schemas_1.createTokenSchema.safeParse(body, email);
    console.log("hct", email);
    if (!validation.success) {
        return c.json({ error: validation.error.errors }, 400);
    }
    const { token_address, balance } = validation.data;
    if (!token_address || !balance) {
        return c.json({ error: "Missing required fields" });
    }
    try {
        await (0, token_1.createToken)(email, token_address, balance);
        return c.json({ message: "Token created successfully" });
    }
    catch (error) {
        console.error("Error creating token:", error);
        return c.json({ error: "Failed to create token" });
    }
};
exports.handleCreateToken = handleCreateToken;
const handleGetTokens = async (c) => {
    const email = c.get("email");
    console.log("from handler", email);
    try {
        const tokens = await (0, token_1.getTokensByEmail)(email);
        //console.log(typeof tokens);
        return c.json(tokens);
    }
    catch (error) {
        return c.json({ error: "An internal server error occurred" }, 500);
    }
};
exports.handleGetTokens = handleGetTokens;
// Handle Update Token
const handleUpdateToken = async (c) => {
    console.log("i am in backend ka authcontroller.ts ka update");
    const body = await c.req.json();
    const validation = schemas_1.updateTokenSchema.safeParse(body);
    if (!validation.success) {
        return c.json({ error: validation.error.errors }, 400);
    }
    const { token_address, balance } = validation.data;
    const id = c.req.param("id");
    if (!token_address || !balance || !id) {
        return c.json({ error: "Missing required fields" }, 400);
    }
    try {
        await (0, token_1.updateToken)(token_address, balance);
        return c.json({ message: "Token updated successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return c.json({ error: error.message }, 400);
        }
        else {
            return c.json({ error: "An unexpected error occurred" }, 500);
        }
    }
};
exports.handleUpdateToken = handleUpdateToken;
// Handle Delete Token
const handleDeleteToken = async (c) => {
    const { id } = c.req.param();
    if (!id) {
        return c.json({ error: "Missing required fields" });
    }
    try {
        await (0, token_1.deleteToken)(Number(id));
        return c.json({ message: "Token deleted successfully" });
    }
    catch (error) {
        return c.json({ error: "Failed to delete token" });
    }
};
exports.handleDeleteToken = handleDeleteToken;
const handleGetSingularTokens = async (c) => {
    const email = c.get("email");
    console.log("from handler gst ", email);
    const body = await c.req.json();
    const { token_address } = body;
    //const email = c.get("email");
    console.log("from handler gst ", email, token_address);
    try {
        const tokens = await (0, token_1.getTokensByTokenAddress)(email, token_address);
        return c.json(tokens);
    }
    catch (error) {
        return c.json({ error: "An internal server error occurred" }, 500);
    }
};
exports.handleGetSingularTokens = handleGetSingularTokens;
