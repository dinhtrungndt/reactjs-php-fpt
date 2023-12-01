// CaNhanScreen.jsx
import React from "react";
import UserProfile from "../components/UserProfile";
import "../components/UserProfile.css"; // Import tệp CSS của bạn

const CaNhanScreen = () => {
  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  };

  const user = getUserFromLocalStorage();
  return (
    <div>
      <h1 style={{ paddingLeft: 250 }}>Trang cá nhân</h1>
      {user && <UserProfile user={user} />}
    </div>
  );
};

export default CaNhanScreen;
