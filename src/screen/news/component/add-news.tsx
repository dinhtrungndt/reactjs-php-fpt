import React, { useState } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/NewsModal.css";

Modal.setAppElement("#root"); // Cần chỉ định một phần tử gốc cho modal

function NewsModal({ isOpen, onRequestClose, onNewsAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [user_id, setUserId] = useState("");
  const [topic_id, setTopicId] = useState("");

  const handleSaveNews = async () => {
    try {
      const body = { title, content, image, user_id, topic_id };
      const result = await AxiosInstance().post("/add-news.php", body);
      console.log(result);

      // Vui lòng nhập đầy đủ thông tin
      if (
        title === "" ||
        content === "" ||
        image === "" ||
        user_id === "" ||
        topic_id === ""
      ) {
        return toast.error("Vui lòng nhập đầy đủ thông tin!");
      }

      toast.success("Thêm Tin Tức thành công!");
      // Reset form
      setTitle("");
      setContent("");
      setImage("");
      setUserId("");
      setTopicId("");
      onNewsAdded();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm Tin Tức"
      className="custom-modal"
    >
      <h2>Thêm Tin Tức</h2>
      <form>
        <div>
          <label htmlFor="title">Tiêu đề:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Nội dung:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Hình ảnh:</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="user_id">User ID:</label>
          <input
            type="number"
            id="user_id"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="topic_id">Topic ID:</label>
          <input
            type="number"
            id="topic_id"
            value={topic_id}
            onChange={(e) => setTopicId(e.target.value)}
          />
        </div>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy thêm Tin Tức
      </button>
      <button className="save-btn" onClick={handleSaveNews}>
        Lưu Tin Tức
      </button>
    </Modal>
  );
}

export default NewsModal;
