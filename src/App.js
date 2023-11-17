import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom"; // Import CSS từ Bootstrap

import SignInScreen from "./signin/index.tsx";
import NewsScreen from "./screen/news/index.tsx";
import LichHocScreen from "./screen/lichhoc/index.tsx";
import BangDiemScreen from "./screen/bangdiem/bangdiem.tsx";
import ProfileScreen from "./screen/profile/index.tsx";
import NewsModal from "./screen/news/component/add-news.tsx";

function App() {
  // đọc thông tin user từ localStorage
  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  };

  // lưu thông tin user vào localStorage
  const saveUserToLocalStorage = (userInfo) => {
    if (!userInfo) {
      localStorage.removeItem("user");
      setUser(null);
      return;
    }
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const [user, setUser] = useState(getUserFromLocalStorage);

  // những component cần phải đăng nhập mới được truy cập
  const ProtectedRoute = () => {
    if (user) {
      return <Outlet />;
    }
    return <Navigate to="/signin" />;
  };

  // những component không cần phải đăng nhập
  const PublicRoute = () => {
    if (user) {
      return <Navigate to="/" />;
    }
    return <Outlet />;
  };

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route
              path="/signin"
              element={<SignInScreen saveUser={saveUserToLocalStorage} />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<NewsScreen userId={user ? user.id : null} />}
            />
            <Route path="/lichhoc" element={<LichHocScreen />} />
            <Route path="/bangdiem" element={<BangDiemScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
