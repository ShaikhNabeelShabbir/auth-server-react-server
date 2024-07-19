"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenSchema = exports.resetPasswordSchema = exports.updateTokenSchema = exports.createTokenSchema = exports.signInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.createTokenSchema = zod_1.z.object({
    token_address: zod_1.z.string(),
    balance: zod_1.z.number().positive(),
});
exports.updateTokenSchema = zod_1.z.object({
    token_address: zod_1.z.string(),
    balance: zod_1.z.number().positive(),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    newPassword: zod_1.z.string().min(6),
});
exports.getTokenSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
