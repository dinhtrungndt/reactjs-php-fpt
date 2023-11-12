import React, { useState } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/AddUsers.css";

Modal.setAppElement("#root"); // Cần chỉ định một phần tử gốc cho modal

function AddUsers({ isOpen, onRequestClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSaveUser = async () => {
    try {
      const emailExist = await checkEmailExist(email);

      if (emailExist) {
        return toast.error("Email đã tồn tại!");
      } else if (
        email === "" ||
        password === "" ||
        name === "" ||
        role === "" ||
        avatar === ""
      ) {
        return toast.error("Vui lòng nhập đầy đủ thông tin!");
      }

      // Tiến hành thêm người dùng nếu email chưa tồn tại
      const body = { email, password, name, role, avatar };
      const result = await AxiosInstance().post("/add-users.php", body);
      console.log(result);

      // Kiểm tra và đóng modal nếu người dùng được thêm thành công
      toast.success("Thêm người dùng thành công!");

      // Reset form
      setEmail("");
      setPassword("");
      setName("");
      setRole("");
      setAvatar("");
    } catch (e) {
      console.log(e);
      // Hiển thị thông báo lỗi
      toast.error("Thêm người dùng thất bại!");
    }
  };

  // Kiểm tra email đã tồn tại hay không
  const checkEmailExist = async (email) => {
    try {
      const result = await AxiosInstance().get(
        `/check-email.php?email=${email}`
      );
      return result.data.exists;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm người dùng"
      className="custom-modal"
    >
      <h2>Thêm người dùng</h2>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="text"
            id="avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy thêm người dùng
      </button>
      <button className="save-btn" onClick={handleSaveUser}>
        Lưu người dùng
      </button>
    </Modal>
  );
}

export default AddUsers;
