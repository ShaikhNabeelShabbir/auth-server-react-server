import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createToken } from "../api/api"; // Import the API function

interface CreateTokenProps {
  token: string;
}

interface TokenData {
  tokenAddress: string;
  balance: number;
}

const CreateToken: React.FC<CreateTokenProps> = ({ token }) => {
  const tokenAddressRef = useRef<HTMLInputElement | null>(null);
  const balanceRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const mutation: UseMutationResult<any, Error, TokenData> = useMutation({
    mutationFn: (newTokenData: TokenData) =>
      createToken(token, newTokenData.tokenAddress, newTokenData.balance),
    onMutate: () => {
      setLoading(true);
      setError("");
    },
    onSuccess: () => {
      alert("Token created successfully");
      if (tokenAddressRef.current) tokenAddressRef.current.value = "";
      if (balanceRef.current) balanceRef.current.value = "0";
      setLoading(false);
      navigate("/");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to create token");
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tokenAddressRef.current && balanceRef.current) {
      mutation.mutate({
        tokenAddress: tokenAddressRef.current.value,
        balance: Number(balanceRef.current.value),
      });
    }
  };

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="container">
      <h2>Create Token</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Token Address:</label>
          <input type="text" ref={tokenAddressRef} required />
        </div>
        <div>
          <label>Balance:</label>
          <input type="number" ref={balanceRef} required />
        </div>
        {error && <span className="error">{error}</span>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Token"}
        </button>
      </form>
    </div>
  );
};

export default CreateToken;
