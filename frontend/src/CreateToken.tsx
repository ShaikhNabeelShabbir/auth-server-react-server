import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CreateTokenProps {
  token: string;
}

const CreateToken: React.FC<CreateTokenProps> = ({ token }) => {
  const [token_address, settoken_address] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/tokens",
        { token_address, balance },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Token created successfully");
        settoken_address("");
        setBalance(0);
        navigate("/"); // Navigate to home route after token creation
      } else {
        setError(response.data.message || "Failed to create token");
      }
    } catch (error) {
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
            value={token_address}
            onChange={(e) => settoken_address(e.target.value)}
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
