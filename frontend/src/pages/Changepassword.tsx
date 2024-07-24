import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/api"; // Import the API function
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

  const mutation = useMutation({
    mutationFn: (data: {
      email: string;
      currentPassword: string;
      newPassword: string;
    }) =>
      changePassword(data.email, data.currentPassword, data.newPassword, token),
    onSuccess: () => {
      setSuccess("Password changed successfully");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to change password");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    mutation.mutate({ email: currentUser, currentPassword, newPassword });
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
