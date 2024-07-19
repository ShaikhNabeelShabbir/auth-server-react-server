import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

const JWT_SECRET = String(process.env.JWT_SECRET);

export interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");
  if (typeof authHeader !== "undefined") {
    const bearer = authHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const decoded = jwt.verify(bearerToken, JWT_SECRET) as DecodedToken;
      c.set("user", decoded);
      c.set("email", decoded.email);
      console.log("the mail", decoded.email);
      await next();
    } catch (error) {
      return c.json({ result: "token is invalid" }, 401);
    }
  } else {
    return c.json({ result: "Authorization header missing" }, 401);
  }
};
