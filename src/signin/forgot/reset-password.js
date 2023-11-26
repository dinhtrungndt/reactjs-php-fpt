import React, { useState, useEffect } from "react";
import AxiosInstance from "../../helper/AxiosInstance";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = (props) => {
  const [params, setParams] = useSearchParams();
  const [token, setToken] = useState(params.get("token"));
  const [email, setEmail] = useState(params.get("email"));
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const body = {
          token: token,
          email: email,
        };
        const response = await AxiosInstance().post(
          `/check-reset-password.php`,
          body
        );
        setIsValid(response.status);
      } catch (error) {
        console.log(error);
      }
    };
    checkToken();
  }, [token, email]);

  const handleResetPassword = async () => {
    try {
      const body = {
        token: token,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      };
      const response = await AxiosInstance().post(`/reset-password.php`, body);
      if (response.status === true) {
        toast.success("Password reset successful!");
      } else {
        toast.error("Email or token is invalid.");
      }

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  if (!email || !token || !isValid) {
    return (
      <div className="container">
        <h1 className="mt-5">404 Not Found</h1>
      </div>
    );
  }

  return (
    <div className=" mt-5">
      <h1 className="mb-4">Reset Password</h1>
      <form>
        <div className="form-group">
          <label>New Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            value={password_confirmation}
            onChange={(e) => setPassword_confirmation(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button
            onClick={handleResetPassword}
            type="button"
            className="btn btn-primary"
          >
            {password === password_confirmation
              ? "Đổi mật khẩu"
              : "Vui lòng kiểm tra lại mật khẩu"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
