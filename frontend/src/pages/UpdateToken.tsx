import React, { useState } from "react";

const UpdateToken: React.FC = () => {
  const [tokenId, setTokenId] = useState<number | "">("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [balance, setBalance] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!tokenId || !tokenAddress || balance === "") {
      setError("Please fill all fields");
      return;
    }

    try {
      const authToken = sessionStorage.getItem("token");

      if (!authToken) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/auth/tokens/${tokenId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ token_address: tokenAddress, balance }),
        }
      );

      if (response.ok) {
        setMessage("Token updated successfully");
        setTokenId("");
        setTokenAddress("");
        setBalance("");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update token");
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
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
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
