import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateRoute";
import ChangePassword from "./pages/Changepassword";
import CreateToken from "./pages/CreateToken";
import ViewTokens from "./pages/ViewTokens";
import DeleteToken from "./pages/DeleteToken";
import UpdateToken from "./pages/UpdateToken"; // Import the new component
import "./styles.css";

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

  const handleRegisterSuccess = (user: User) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    sessionStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleLoginSuccess = (email: string, token: string) => {
    setLoggedIn(true);
    setUsername(email);
    setToken(token);
    sessionStorage.setItem("loggedIn", JSON.stringify(true));
    sessionStorage.setItem("username", email);
    sessionStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setToken("");
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
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
            <Route
              path="/"
              element={<SignUp onRegisterSuccess={handleRegisterSuccess} />}
            />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
          </>
        )}
        <Route element={<PrivateRoutes loggedIn={loggedIn} />}>
          <Route
            path="/change-password"
            element={<ChangePassword token={token} currentUser={username} />}
          />
          <Route path="/create-token" element={<CreateToken token={token} />} />
          <Route path="/view-tokens" element={<ViewTokens />} />
          <Route path="/delete-token" element={<DeleteToken />} />
          <Route path="/update-token" element={<UpdateToken />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
