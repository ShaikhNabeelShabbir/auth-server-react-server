import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../api/api"; // Import the API function
import "../styles.css";

interface LoginProps {
  onLoginSuccess: (email: string, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signIn(user.email, user.password),
    onSuccess: (data) => {
      onLoginSuccess(email, data.token);
      navigate("/"); // Navigate to home page or any other route after login
    },
    onError: (error: any) => {
      setError(error.message || "Failed to login");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <span className="error">{error}</span>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
