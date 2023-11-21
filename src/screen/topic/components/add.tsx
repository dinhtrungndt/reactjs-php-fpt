import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/AddUsers.css";

Modal.setAppElement("#root"); // Cần chỉ định một phần tử gốc cho modal

function AddChuDe({ isOpen, onRequestClose, onNewsAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState([]);

  const handleSave = async () => {
    try {
      // Tạo đối tượng FormData chứa dữ liệu người dùng
      const body = {
        name,
        description,
      };
      const result = await AxiosInstance().post("/add-topics.php", body);
      console.log(result);

      // Vui lòng nhập đầy đủ thông tin
      if (name === "" || description === "") {
        return toast.error("Vui lòng nhập đầy đủ thông tin!");
      }

      // Kiểm tra xem chủ đề đã tồn tại hay chưa
      const topicExists = topics.find((topic) => topic.name === name);

      if (topicExists) {
        return toast.error("Chủ đề đã tồn tại!");
      }
      // Thêm chủ đề mới vào danh sách
      setTopics([...topics, { name, description }]);

      // Tiếp tục xử lý và đóng modal nếu người dùng được thêm thành công
      toast.success("Thêm chủ đề thành công!");

      // Reset form
      setName("");
      setDescription("");
      onNewsAdded();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm chủ đề"
      className="custom-modal"
    >
      <h2>Thêm chủ đề</h2>
      <form>
        <div>
          <label htmlFor="monhoc">Tên chủ đề:</label>
          <input
            type="text"
            id="monhoc"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="decscription">Miêu tả:</label>
          <textarea
            id="decscription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy thêm môn
      </button>
      <button className="save-btn" onClick={handleSave}>
        Lưu môn học
      </button>
    </Modal>
  );
}

export default AddChuDe;
