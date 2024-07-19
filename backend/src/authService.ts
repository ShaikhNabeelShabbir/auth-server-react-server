import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "./user";
import dbPromise from "./db";
import dotenv from "dotenv";
import { createToken } from "./token";
dotenv.config();

const JWT_SECRET = String(process.env.JWT_SECRET);

// defining the functionality behind signin singup and reset password
export const signUp = async (
  email: string,
  password: string,
  token_address: string
): Promise<void> => {
  const hashedPassword = await argon2.hash(password);
  await createUser(email, hashedPassword);
};

export const signIn = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await getUserByEmail(email);
  if (!user || !(await argon2.verify(user.password, password))) {
    throw new Error("Invalid email or password");
  }
  const payload = {
    userId: user.id,
    email: user.email  // Include email in the payload
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<void> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await argon2.hash(newPassword);
  const db = await dbPromise;
  await db.run(
    "UPDATE users SET password = ? WHERE email = ?",
    hashedPassword,
    email
  );
};
