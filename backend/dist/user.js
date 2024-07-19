"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserByEmail = void 0;
const db_1 = __importDefault(require("./db"));
//getuserbyemail to use in signin service to check if user exist
const getUserByEmail = async (email) => {
    const db = await db_1.default;
    const user = await db.get("SELECT * FROM users WHERE email = ?", email);
    return user;
};
exports.getUserByEmail = getUserByEmail;
//create and enter the user into the database
const createUser = async (email, password) => {
    const db = await db_1.default;
    await db.run("INSERT INTO users (email, password) VALUES (?, ?)", email, password);
};
exports.createUser = createUser;
