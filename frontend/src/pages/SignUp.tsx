import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/api"; // Import the API function
import "../styles.css";

interface SignUpProps {
  onRegisterSuccess: (user: { email: string; password: string }) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = (): boolean => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const mutation = useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signUp(user.email, user.password),
    onSuccess: () => {
      onRegisterSuccess({ email, password });
      alert("Sign up successful");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to register");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate({ email, password });
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <span className="error">{error}</span>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
