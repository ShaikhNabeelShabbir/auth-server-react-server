import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import axios from "axios";

interface LoginProps {
  onLoginSuccess: (email: string, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        onLoginSuccess(email, token);
        navigate("/"); // Navigate to home page or any other route after login
      } else {
        setError(response.data.message || "Failed to login");
      }
    } catch (error) {
      setError("Failed to login");
    }
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
