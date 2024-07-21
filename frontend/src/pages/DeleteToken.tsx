import React, { useState } from "react";

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

      const response = await fetch(
        `http://localhost:5000/auth/tokens/${tokenId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage("Token deleted successfully");
        setTokenId("");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete token");
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
