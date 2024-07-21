import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CreateTokenProps {
  token: string;
}

const CreateToken: React.FC<CreateTokenProps> = ({ token }) => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token_address: tokenAddress, balance }),
      });

      if (response.ok) {
        alert("Token created successfully");
        setTokenAddress("");
        setBalance(0);
        navigate("/"); // Navigate to home route after token creation
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create token");
      }
    } catch (error) {
      console.error("Error creating token:", error);
      setError("Failed to create token");
    }
  };

  return (
    <div className="container">
      <h2>Create Token</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Token Address:</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Balance:</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            required
          />
        </div>
        {error && <span>{error}</span>}
        <button type="submit">Create Token</button>
      </form>
    </div>
  );
};

export default CreateToken;
