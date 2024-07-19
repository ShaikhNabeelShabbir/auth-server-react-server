import React, { useState, useEffect } from "react";
import axios from "axios";

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

        const response = await axios.get("http://localhost:5000/auth/tokens", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response data:", response.data); // Log the response data

        if (response.status === 200) {
          setTokens(response.data); // Ensure response.data is correctly set
        } else {
          setError(response.data.message || "Failed to fetch tokens");
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
            <strong>Balance:</strong> {token.balance}
            <strong>ID:</strong> {token.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTokens;
