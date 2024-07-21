import React, { useState } from "react";
import "../styles.css";

interface ChangePasswordProps {
  token: string;
  currentUser: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  token,
  currentUser,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: currentUser,
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Password changed successfully");
        setError("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to change password");
      }
    } catch (error) {
      setError("Failed to change password");
    }
  };

  return (
    <div className="container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <span className="error">{error}</span>}
        {success && <span className="success">{success}</span>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
