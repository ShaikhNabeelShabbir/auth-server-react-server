import React, { useState } from "react";
import axios from "axios";

const UpdateToken: React.FC = () => {
  const [tokenId, setTokenId] = useState<number | "">("");
  const [token_address, settoken_address] = useState("");
  const [balance, setBalance] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!tokenId || !token_address || balance === "") {
      setError("Please fill all fields");
      return;
    }

    try {
      const authToken = sessionStorage.getItem("token");

      if (!authToken) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/auth/tokens/${tokenId}`,
        { token_address: token_address, balance },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Token updated successfully");
        setTokenId("");
        settoken_address("");
        setBalance("");
      } else {
        setError(response.data.message || "Failed to update token");
      }
    } catch (error) {
      console.error("Error updating token:", error);
      setError("Failed to update token");
    }
  };

  return (
    <div className="container">
      <h2>Update Token</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Token ID:</label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(Number(e.target.value))}
            required
          />
        </div>
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
          <label>New Balance:</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Update Token</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default UpdateToken;
