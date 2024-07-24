import React, { useRef, useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { updateToken } from "../api/api"; // Import the API function

const UpdateToken: React.FC = () => {
  const tokenIdRef = useRef<HTMLInputElement | null>(null);
  const tokenAddressRef = useRef<HTMLInputElement | null>(null);
  const balanceRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const mutation: UseMutationResult<
    any,
    Error,
    { tokenId: number; tokenAddress: string; balance: number }
  > = useMutation({
    mutationFn: ({ tokenId, tokenAddress, balance }) => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      return updateToken(token, tokenId, tokenAddress, balance);
    },
    onMutate: () => {
      setLoading(true);
      setError("");
    },
    onSuccess: () => {
      setMessage("Token updated successfully");
      if (tokenIdRef.current) tokenIdRef.current.value = "";
      if (tokenAddressRef.current) tokenAddressRef.current.value = "";
      if (balanceRef.current) balanceRef.current.value = "0";
      setLoading(false);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to update token");
      setLoading(false);
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tokenIdRef.current && tokenAddressRef.current && balanceRef.current) {
      const tokenId = Number(tokenIdRef.current.value);
      const tokenAddress = tokenAddressRef.current.value;
      const balance = Number(balanceRef.current.value);
      mutation.mutate({ tokenId, tokenAddress, balance });
    }
  };

  return (
    <div className="container">
      <h2>Update Token</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Token ID:</label>
          <input type="number" ref={tokenIdRef} required />
        </div>
        <div>
          <label>Token Address:</label>
          <input type="text" ref={tokenAddressRef} required />
        </div>
        <div>
          <label>New Balance:</label>
          <input type="number" ref={balanceRef} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Token"}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UpdateToken;
