// UserProfile.jsx
import React from "react";
import "./UserProfile.css"; // Import tệp CSS của bạn

const UserProfile = ({ user }) => {
  return (
    <div
      className="user-profile-container"
      style={{ marginRight: 250, marginTop: -10 }}
    >
      <div className="user-profile">
        <img src={user.avatar} alt={user.email} className="profile-image" />
        <h4 className="profile-greeting">Xin chào, {user.email}</h4>
        <p className="profile-info">Tên: {user.name}</p>
        <p className="profile-info">Vai trò: {user.role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
