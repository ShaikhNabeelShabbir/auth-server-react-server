"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.signIn = exports.signUp = void 0;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./user");
const db_1 = __importDefault(require("./db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = String(process.env.JWT_SECRET);
// defining the functionality behind signin singup and reset password
const signUp = async (email, password, token_address) => {
    const hashedPassword = await argon2_1.default.hash(password);
    await (0, user_1.createUser)(email, hashedPassword);
};
exports.signUp = signUp;
const signIn = async (email, password) => {
    const user = await (0, user_1.getUserByEmail)(email);
    if (!user || !(await argon2_1.default.verify(user.password, password))) {
        throw new Error("Invalid email or password");
    }
    const payload = {
        userId: user.id,
        email: user.email // Include email in the payload
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return token;
};
exports.signIn = signIn;
const resetPassword = async (email, newPassword) => {
    const user = await (0, user_1.getUserByEmail)(email);
    if (!user) {
        throw new Error("User not found");
    }
    const hashedPassword = await argon2_1.default.hash(newPassword);
    const db = await db_1.default;
    await db.run("UPDATE users SET password = ? WHERE email = ?", hashedPassword, email);
};
exports.resetPassword = resetPassword;
