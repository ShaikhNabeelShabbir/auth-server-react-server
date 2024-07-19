import { Context } from "hono";
import jwt from "jsonwebtoken";
import { signUp, signIn, resetPassword } from "./authService";
import {
  signUpSchema,
  signInSchema,
  createTokenSchema,
  updateTokenSchema,
  resetPasswordSchema,
  getTokenSchema,
} from "./schemas";

import dotenv from "dotenv";
import {
  createToken,
  deleteToken,
  getTokensByEmail,
  getTokensByTokenAddress,
  updateToken,
} from "./token";
dotenv.config();
const JWT_SECRET = String(process.env.JWT_SECRET);

interface SignUpBody {
  email: string;
  password: string;
}

interface SignInBody {
  email: string;
  password: string;
}

interface ResetPasswordBody {
  email: string;
  newPassword: string;
}

interface TokenBody {
  id: number;
  email: string;
  balance: number;
  token_address: string;
}

// defining the functionality behind signin singup and reset password
export const handleSignUp = async (c: Context): Promise<Response> => {
  const body = await c.req.json<SignUpBody>();
  const validation = signUpSchema.safeParse(body);

  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  const { email, password } = validation.data;
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  await signUp(email, password, token);
  return c.json({ message: "User created successfully", token });
};

export const handleSignIn = async (c: Context): Promise<Response> => {
  const body = await c.req.json<SignInBody>();
  const validation = signInSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  const { email, password } = validation.data;
  try {
    const token = await signIn(email, password);
    return c.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: "Invalid email or password" }, 401);
    } else {
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
};

export const handleResetPassword = async (c: Context): Promise<Response> => {
  const body = await c.req.json<ResetPasswordBody>();
  const validation = resetPasswordSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  const { email, newPassword } = validation.data;
  try {
    await resetPassword(email, newPassword);
    return c.json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    } else {
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
};

export const handleCreateToken = async (c: Context): Promise<Response> => {
  const body = await c.req.json<TokenBody>();
  const email = c.get("email");
  const validation = createTokenSchema.safeParse(body, email);
  console.log("hct", email);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }

  const { token_address, balance } = validation.data;
  if (!token_address || !balance) {
    return c.json({ error: "Missing required fields" });
  }

  try {
    await createToken(email, token_address, balance);
    return c.json({ message: "Token created successfully" });
  } catch (error) {
    console.error("Error creating token:", error);
    return c.json({ error: "Failed to create token" });
  }
};

export const handleGetTokens = async (c: Context): Promise<Response> => {
  const email = c.get("email");
  console.log("from handler", email);

  try {
    const tokens = await getTokensByEmail(email);
    //console.log(typeof tokens);
    return c.json(tokens);
  } catch (error) {
    return c.json({ error: "An internal server error occurred" }, 500);
  }
};

// Handle Update Token
export const handleUpdateToken = async (c: Context): Promise<Response> => {
  console.log("i am in backend ka authcontroller.ts ka update");

  const body = await c.req.json<TokenBody>();
  const validation = updateTokenSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  const { token_address, balance } = validation.data;
  const id = c.req.param("id");
  if (!token_address || !balance || !id) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  try {
    await updateToken(token_address, balance);
    return c.json({ message: "Token updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    } else {
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
};

// Handle Delete Token
export const handleDeleteToken = async (c: Context): Promise<Response> => {
  const { id } = c.req.param();
  if (!id) {
    return c.json({ error: "Missing required fields" });
  }

  try {
    await deleteToken(Number(id));
    return c.json({ message: "Token deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete token" });
  }
};

export const handleGetSingularTokens = async (
  c: Context
): Promise<Response> => {
  const email = c.get("email");
  console.log("from handler gst ", email);
  const body = await c.req.json<TokenBody>();
  const { token_address } = body;
  //const email = c.get("email");
  console.log("from handler gst ", email, token_address);

  try {
    const tokens = await getTokensByTokenAddress(email, token_address);
    return c.json(tokens);
  } catch (error) {
    return c.json({ error: "An internal server error occurred" }, 500);
  }
};
