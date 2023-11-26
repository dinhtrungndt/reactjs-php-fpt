import React, { useState } from "react";
import AxiosInstance from "../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ForgotPasswordProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onNewsAdded: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  isOpen,
  onRequestClose,
  onNewsAdded,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance().post("/forgot-password.php", {
        email,
      });

      if (response.status) {
        toast.success("Email sent successfully");
      } else {
        toast.error("Email not found");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending email.");
    }
  };

  return (
    <div style={{ height: 300 }}>
      <div className="row justify-content-center">
        <div className="card-body">
          <h1 className="card-title text-center">Send Email</h1>
          <div className="form-group m-5">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleSendEmail}>
              {loading ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
