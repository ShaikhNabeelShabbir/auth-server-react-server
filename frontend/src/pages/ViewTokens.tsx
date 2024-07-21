import React, { useState, useEffect } from "react";

interface Token {
  id: number;
  email: string;
  token_address: string;
  balance: number;
}

const ViewTokens: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          setError("No token found");
          return;
        }

        const response = await fetch("http://localhost:5000/auth/tokens", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTokens(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch tokens");
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setError("Failed to fetch tokens");
      }
    };

    fetchTokens();
  }, []);

  return (
    <div className="container">
      <h2>Your Tokens</h2>
      {error && <p>{error}</p>}
      <ul>
        {tokens.map((token) => (
          <li key={token.id}>
            <strong>Address:</strong> {token.token_address},{" "}
            <strong>Balance:</strong> {token.balance}, <strong>ID:</strong>{" "}
            {token.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTokens;
