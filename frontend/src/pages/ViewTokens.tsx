import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens, Token } from "../api/api"; // Import the API function and Token type

const ViewTokens: React.FC = () => {
  const { data, error, isLoading } = useQuery<Token[], Error>({
    queryKey: ["tokens"],
    queryFn: () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      return fetchTokens(token);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      <h2>Your Tokens</h2>
      <ul>           
        {data?.map((token) => (
          <li key={token.id}>
            <div className="card grid size-auto mb-5 m-10 bg-sky-500">
            <strong>Address:</strong> {token.token_address},{" "}
            <strong>Balance:</strong> {token.balance}, <strong>ID:</strong>{" "}
            {token.id}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTokens;
