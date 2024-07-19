import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import PrivateRoutes from "./PrivateRoute";
import ChangePassword from "./Changepassword";
import CreateToken from "./CreateToken";
import ViewTokens from "./ViewTokens";
import DeleteToken from "./DeleteToken";
import UpdateToken from "./UpdateToken"; // Import the new component
import "./styles.css";
import axios from "axios";

interface User {
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = sessionStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    const savedLoggedIn = sessionStorage.getItem("loggedIn");
    return savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
  });

  const [username, setUsername] = useState<string>(() => {
    const savedUsername = sessionStorage.getItem("username");
    return savedUsername || "";
  });

  const [token, setToken] = useState<string>(() => {
    const savedToken = sessionStorage.getItem("token");
    return savedToken || "";
  });

  const handleRegister = (user: User) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    sessionStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        setLoggedIn(true);
        setUsername(email);
        setToken(token);
        sessionStorage.setItem("loggedIn", JSON.stringify(true));
        sessionStorage.setItem("username", email);
        sessionStorage.setItem("token", token);
      } else {
        console.error("Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setToken("");
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
  };

  const handleChangePassword = async (newPassword: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/change-password",
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedUsers = users.map((user) =>
          user.email === username ? { ...user, password: newPassword } : user
        );
        setUsers(updatedUsers);
        sessionStorage.setItem("users", JSON.stringify(updatedUsers));
        alert("Password changed successfully");
      } else {
        console.error("Change password failed:", response.data.message);
      }
    } catch (error) {
      console.error("Change password error:", error);
    }
  };

  const handleCreateToken = async (address: string, balance: number) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/token/create",
        { address, balance },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(`Token created: ${address} with balance ${balance}`);
        alert("Token created successfully");
      } else {
        console.error("Create token failed:", response.data.message);
      }
    } catch (error) {
      console.error("Create token error:", error);
    }
  };

  return (
    <Router>
      <div className="container">
        <h3>Welcome to the App</h3>
        {loggedIn ? (
          <>
            <p>You are logged in as {username}</p>
            <button onClick={handleLogout}>Logout</button>
            <br />
            <Link to="/change-password">
              <button>Change Password</button>
            </Link>
            <Link to="/create-token">
              <button>Create Token</button>
            </Link>
            <Link to="/view-tokens">
              <button>View Tokens</button>
            </Link>
            <Link to="/delete-token">
              <button>Delete Token</button>
            </Link>
            <Link to="/update-token">
              <button>Update Token</button>
            </Link>
          </>
        ) : (
          <>
            <p>Already a user?</p>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <br />
            <Link to="/">
              <button>Signup</button>
            </Link>
          </>
        )}
      </div>
      <Routes>
        {!loggedIn && (
          <>
            <Route path="/" element={<SignUp onRegister={handleRegister} />} />
            <Route
              path="/login"
              element={<Login users={users} onLogin={handleLogin} />}
            />
          </>
        )}
        <Route element={<PrivateRoutes loggedIn={loggedIn} />}>
          <Route
            path="/change-password"
            element={
              <ChangePassword
                onChangePassword={handleChangePassword}
                currentUser={username}
              />
            }
          />
          <Route
            path="/create-token"
            element={<CreateToken onCreateToken={handleCreateToken} />}
          />
          <Route path="/view-tokens" element={<ViewTokens />} />
          <Route path="/delete-token" element={<DeleteToken />} />
          <Route path="/update-token" element={<UpdateToken />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
