"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokensByTokenAddress = exports.updateToken = exports.deleteToken = exports.createToken = exports.getTokensByEmail = void 0;
const db_1 = __importDefault(require("./db"));
const getTokensByEmail = async (email) => {
    console.log("from get tokens by email");
    console.log("Email being queried:", email);
    const db = await db_1.default;
    try {
        const tokens = await db.all("SELECT * FROM tokens WHERE email = ?", email);
        console.log("Tokens found:", tokens);
        return tokens;
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch tokens from the database");
    }
};
exports.getTokensByEmail = getTokensByEmail;
const createToken = async (email, token_address, balance) => {
    console.log("i am in backend ka token.ts ka update");
    const db = await db_1.default;
    await db.run("INSERT INTO tokens (email,token_address, balance) VALUES (?,?, ?)", email, token_address, balance);
};
exports.createToken = createToken;
const deleteToken = async (id) => {
    const db = await db_1.default;
    await db.run("DELETE FROM tokens WHERE id = ?", id);
};
exports.deleteToken = deleteToken;
const updateToken = async (token_address, balance) => {
    const db = await db_1.default;
    await db.run("update tokens SET balance = ? WHERE token_address = ?", balance, token_address);
};
exports.updateToken = updateToken;
const getTokensByTokenAddress = async (email, token_address) => {
    console.log("from get tokens by email");
    console.log("Email being queried:", email);
    const db = await db_1.default;
    try {
        const tokens = await db.all("SELECT * FROM tokens WHERE email = ? and token_address = ?", email, token_address);
        console.log("Tokens found:", tokens);
        return tokens;
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch tokens from the database");
    }
};
exports.getTokensByTokenAddress = getTokensByTokenAddress;
