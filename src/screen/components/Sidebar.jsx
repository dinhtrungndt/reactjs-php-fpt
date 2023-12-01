import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTh,
  FaBars,
  FaUserAlt,
  FaClipboardList,
  FaShoppingBag,
  FaReceipt,
  FaUserCircle,
  FaIgloo,
  FaUsers,
  FaHome,
  FaBookReader,
  FaBookOpen,
} from "react-icons/fa";
import { AiFillSchedule, AiOutlineLineChart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdAccountCircle, MdTopic, MdAttachMoney } from "react-icons/md";
import { PiStudentDuotone } from "react-icons/pi";
import { GiBookStorm } from "react-icons/gi";
import { IoNewspaper } from "react-icons/io5";

import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const Sidebar = ({ children }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  };

  const user = getUserFromLocalStorage();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const menuItem = [
    {
      name: "Trang chủ",
      icon: <FaHome />,
      path: "/",
    },
    {
      name: "Lịch học",
      icon: <AiFillSchedule />,
      path: "/lichhoc",
    },

    {
      name: "Chủ đề",
      icon: <GiBookStorm />,
      path: "/chude",
    },
    {
      name: "Môn học",
      icon: <FaBookOpen />,
      path: "/monhoc",
    },
    {
      name: "Học sinh",
      icon: <PiStudentDuotone />,
      path: "/student",
    },
    {
      name: "Học phí",
      icon: <MdAttachMoney />,
      path: "/hocphi",
    },
    {
      name: "Hồ sơ",
      icon: (
        <NavDropdown title="" id="basic-nav-dropdown">
          <NavDropdown.Item
            as={NavLink}
            to="/profile"
            style={{ paddingLeft: 20 }}
          >
            Profile
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} to="/profile/menews">
            Bài viết của tôi
          </NavDropdown.Item>
        </NavDropdown>
      ),
      path: "/profile",
    },
    {
      name: "Thống kê",
      icon: <AiOutlineLineChart />,
      path: "/chartjss",
    },
  ];

  return (
    <div className="container">
      <div style={{ width: isMenuOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1
            style={{ display: isMenuOpen ? "block" : "none" }}
            className="logo"
          >
            <span
              style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              {user ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              ) : (
                "Admin"
              )}
            </span>
            <span
              style={{
                color: "#7FC8E0",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                marginTop: "10px",
              }}
            >
              {user ? user.name : "Admin"}
            </span>
          </h1>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeClassName="active"
            isActive={(match, location) => {
              // Your custom logic to determine if the link is active
              return location.pathname === item.path;
            }}
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isMenuOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <div
        style={{
          margin: -5,
          padding: 0,
          display: "flex",
        }}
        className="bars"
      >
        {isMenuOpen ? (
          <FaBars
            style={{
              color: "#0b5ed7",
              fontSize: "20px",
              marginLeft: "200px",
              transition: "all 0.5s ease",
              cursor: "pointer",
            }}
            onClick={toggleMenu}
          />
        ) : (
          <>
            <FaBars
              style={{
                color: "#0b5ed7",
                fontSize: "20px",
                transition: "all 0.5s ease",
                cursor: "pointer",
              }}
              onClick={toggleMenu}
            />
            <text
              style={{
                color: "#0b5ed7",
                fontSize: "28px",
                fontWeight: "bold",
                marginLeft: "30px",
                transition: "all 0.5s ease",
                marginTop: "-12px",
              }}
            >
              Danh mục
            </text>
          </>
        )}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
