import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import axios from "axios";

interface User {
  email: string;
  password: string;
}

interface SignUpProps {
  onRegister: (user: User) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onRegister }) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post("http://localhost:5000/auth/signup", {
          email,
          password,
        });

        if (response.status === 200) {
          onRegister({ email, password });
          alert("sign up successfully");
          setEmail(""); // Clear email
          setPassword(""); // Clear password
          setConfirmPassword(""); // Clear confirm password
          navigate("/login"); // Navigate to login page
        } else {
          setError(response.data.message || "Failed to register");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.message || "Failed to register");
        } else {
          setError("Failed to register");
        }
      }
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
        {error && <span>{error}</span>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
