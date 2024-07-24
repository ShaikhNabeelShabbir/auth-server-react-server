import React, { useRef, useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { deleteToken } from "../api/api"; // Import the API function

const DeleteToken: React.FC = () => {
  const tokenIdRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const mutation: UseMutationResult<any, Error, number> = useMutation({
    mutationFn: (tokenId: number) => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      return deleteToken(token, tokenId);
    },
    onMutate: () => {
      setLoading(true);
      setError("");
    },
    onSuccess: () => {
      setMessage("Token deleted successfully");
      if (tokenIdRef.current) tokenIdRef.current.value = "";
      setLoading(false);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to delete token");
      setLoading(false);
    },
  });

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tokenIdRef.current) {
      const tokenId = Number(tokenIdRef.current.value);
      mutation.mutate(tokenId);
    }
  };

  return (
    <div className="container">
      <h2>Delete Token</h2>
      <form onSubmit={handleDelete}>
        <div>
          <label>Token ID:</label>
          <input type="number" ref={tokenIdRef} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Deleting..." : "Delete Token"}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DeleteToken;
