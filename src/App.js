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
import ProfileScreen from "./screen/profile/index.tsx";
import NewsModal from "./screen/news/component/add-news.tsx";
import Sidebar from "./screen/components/Sidebar.jsx";
import TopicScreen from "./screen/topic/index.tsx";
import MonHocScreen from "./screen/monhoc/index.tsx";
import StudentScreen from "./screen/students/index.tsx";
import HocPhiScreen from "./screen/hocphi/index.tsx";
import ChartComponent from "./screen/chartjs/index.js";
import ForgotPassword from "./signin/forgot/index.tsx";
import ResetPassword from "./signin/forgot/reset-password.js";
import MeNewsScreen from "./screen/profile/me_news.tsx";

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
        <Sidebar>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<PublicRoute />}>
              <Route
                path="/signin"
                element={<SignInScreen saveUser={saveUserToLocalStorage} />}
              />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={<NewsScreen userId={user ? user.id : null} />}
              />
              <Route path="/add" element={<NewsModal user={user} />} />
              <Route path="/chude" element={<TopicScreen />} />
              <Route path="/monhoc" element={<MonHocScreen />} />
              <Route path="/lichhoc" element={<LichHocScreen />} />
              <Route element={<ProtectedRoute />}>
                {/* ... (existing code) */}
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/profile/menews" element={<MeNewsScreen />} />
              </Route>
              <Route path="/student" element={<StudentScreen />} />
              <Route
                path="/hocphi"
                element={<HocPhiScreen userId={user ? user.id : null} />}
              />
              <Route path="/chartjss" element={<ChartComponent />} />
            </Route>
          </Routes>
        </Sidebar>
      </Router>
    </div>
  );
}

export default App;
