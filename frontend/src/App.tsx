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
import { Button } from "./components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

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
    <div className="container text-xl w-full h-full p-8">
    <Router>
        <h3>Welcome to the App</h3>
        {loggedIn ? (
          <>
            <br />
            <Button onClick={handleLogout}>Logout</Button>
            <br />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Options?</AccordionTrigger>
                <AccordionContent>
                  <Link to="/change-password">
                    <Button>Change Password</Button>
                  </Link>
                  <br />
                  {/* change here */}
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger>Token Menu</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>
                          <Link to="/create-token">
                            Create Token
                          </Link> 
                          <MenubarShortcut>⌘T</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                          <Link to="/view-tokens">
                            View Tokens
                          </Link>
                        </MenubarItem>
                        <MenubarItem>
                          <Link to="/delete-token">
                            Delete Token
                          </Link>
                        </MenubarItem>
                        <MenubarItem>
                          <Link to="/update-token">
                            Update Token
                          </Link>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <>
            <p>Already a user?</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <br />
            <Link to="/">
              <Button>Signup</Button>
            </Link>
          </>
        )}
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
    </div>
  );
};

export default App;
