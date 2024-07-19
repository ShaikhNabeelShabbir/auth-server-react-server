"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = String(process.env.JWT_SECRET);
const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("authorization");
    if (typeof authHeader !== "undefined") {
        const bearer = authHeader.split(" ");
        const bearerToken = bearer[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(bearerToken, JWT_SECRET);
            c.set("user", decoded);
            c.set("email", decoded.email);
            console.log("the mail", decoded.email);
            await next();
        }
        catch (error) {
            return c.json({ result: "token is invalid" }, 401);
        }
    }
    else {
        return c.json({ result: "Authorization header missing" }, 401);
    }
};
exports.authMiddleware = authMiddleware;
