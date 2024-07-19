import React, { useState } from "react";
import axios from "axios";

const DeleteToken: React.FC = () => {
  const [tokenId, setTokenId] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/auth/tokens/${tokenId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Token deleted successfully");
        setTokenId("");
      } else {
        setError(response.data.message || "Failed to delete token");
      }
    } catch (error) {
      console.error("Error deleting token:", error);
      setError("Failed to delete token");
    }
  };

  return (
    <div className="container">
      <h2>Delete Token</h2>
      <form onSubmit={handleDelete}>
        <div>
          <label>Token ID:</label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Delete Token</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default DeleteToken;
