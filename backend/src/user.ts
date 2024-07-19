import dbPromise from "./db";

// interface to define how the user look like
interface User {
  id: number;
  email: string;
  password: string;
}

//getuserbyemail to use in signin service to check if user exist
export const getUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const db = await dbPromise;
  const user = await db.get<User>("SELECT * FROM users WHERE email = ?", email);
  return user;
};

//create and enter the user into the database
export const createUser = async (
  email: string,
  password: string
): Promise<void> => {
  const db = await dbPromise;
  await db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    email,
    password
  );
};
