import dbPromise from "./db";

interface Token {
  id?: number;
  token_address: string;
  email: string;
  balance: number;
}

export const getTokensByEmail = async (email: string): Promise<Token[]> => {
  console.log("from get tokens by email");
  console.log("Email being queried:", email);
  const db = await dbPromise;
  try {
    const tokens: Token[] = await db.all(
      "SELECT * FROM tokens WHERE email = ?",
      email
    );
    console.log("Tokens found:", tokens);
    return tokens;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch tokens from the database");
  }
};

export const createToken = async (
  email: string,
  token_address: string,
  balance: number
): Promise<void> => {
  console.log("i am in backend ka token.ts ka update");
  const db = await dbPromise;
  await db.run(
    "INSERT INTO tokens (email,token_address, balance) VALUES (?,?, ?)",
    email,
    token_address,
    balance
  );
};

export const deleteToken = async (id: number): Promise<void> => {
  const db = await dbPromise;
  await db.run("DELETE FROM tokens WHERE id = ?", id);
};

export const updateToken = async (
  token_address: string,
  balance: number
): Promise<void> => {
  const db = await dbPromise;
  await db.run(
    "update tokens SET balance = ? WHERE token_address = ?",
    balance,
    token_address
  );
};

export const getTokensByTokenAddress = async (
  email: string,
  token_address: string
): Promise<Token[]> => {
  console.log("from get tokens by email");
  console.log("Email being queried:", email);
  const db = await dbPromise;
  try {
    const tokens: Token[] = await db.all(
      "SELECT * FROM tokens WHERE email = ? and token_address = ?",
      email,
      token_address
    );
    console.log("Tokens found:", tokens);
    return tokens;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch tokens from the database");
  }
};
