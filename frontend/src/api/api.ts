export const createToken = async (
  token: string,
  tokenAddress: string,
  balance: number
): Promise<any> => {
  const response = await fetch("http://localhost:3000/auth/tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token_address: tokenAddress, balance }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to create token");
  }

  return response.json();
};

export const deleteToken = async (
  token: string,
  tokenId: number
): Promise<any> => {
  const response = await fetch(`http://localhost:3000/auth/tokens/${tokenId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete token");
  }

  return response.json();
};

export const updateToken = async (
  token: string,
  tokenId: number,
  tokenAddress: string,
  balance: number
): Promise<any> => {
  const response = await fetch(`http://localhost:3000/auth/tokens/${tokenId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token_address: tokenAddress, balance }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to update token");
  }

  return response.json();
};

export interface Token {
  id: number;
  token_address: string;
  balance: number;
}
export const fetchTokens = async (token: string): Promise<Token[]> => {
  const response = await fetch("http://localhost:3000/auth/tokens", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to fetch tokens");
  }

  return response.json();
};

export const signUp = async (email: string, password: string): Promise<any> => {
  const response = await fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to register");
  }
  return response.json();
};

export const signIn = async (
  email: string,
  password: string
): Promise<{
  email: string; token: string 
}> => {
  const response = await fetch("http://localhost:3000/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to login");
  }
  return response.json();
};

export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
  token: string
): Promise<any> => {
  const response = await fetch("http://localhost:3000/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to change password");
  }
  return response.json();
};
