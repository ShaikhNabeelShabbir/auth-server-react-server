export const createToken = async (
  token: string,
  tokenAddress: string,
  balance: number
): Promise<any> => {
  const response = await fetch("http://localhost:5000/auth/tokens", {
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
  const response = await fetch(`http://localhost:5000/auth/tokens/${tokenId}`, {
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
