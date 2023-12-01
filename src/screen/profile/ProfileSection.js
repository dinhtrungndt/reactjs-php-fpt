// ProfileSection.js
import React from "react";
import { NavLink } from "react-router-dom";
import { MdAccountCircle, FaAngleDown } from "react-icons/fa";

const ProfileSection = ({
  isAngleDownRotated,
  toggleProfileDropdown,
  isProfileDropdownOpen,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <NavLink
        to="/profile"
        className="link"
        activeClassName="active"
        style={{ width: 155 }}
      >
        Profile
      </NavLink>
      <div className="profile-dropdown" onClick={toggleProfileDropdown}>
        <FaAngleDown
          style={{
            marginLeft: 10,
            width: 20,
            height: 20,
            marginTop: 10,
            transform: isAngleDownRotated ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.5s ease",
          }}
        />
      </div>
      {isProfileDropdownOpen && (
        <div className="profile-dropdown-menu">
          <NavLink
            to="/profile/menews"
            className="link"
            activeClassName="active"
          >
            Bài viết của tôi
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
