import React, { useState, useEffect } from "react";
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
  const [topic_id, setTopicId] = useState(1);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedImage(file);
    const formData = new FormData();
    formData.append("image", file);
    const result = await AxiosInstance("multipart/form-data").post(
      "/upload-file.php",
      formData
    );
    console.log(result);
    setImage(result.path);
  };

  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setPreviewImage(imageUrl);
    setImage(imageUrl); // Cập nhật state 'image' với URL ảnh
  };

  const handleSaveNews = async () => {
    try {
      const body = { title, content, image, user_id, topic_id };
      const result = await AxiosInstance().post("/add-news.php", body);
      console.log(result);

      // Vui lòng nhập đầy đủ thông tin
      if (title === "" || content === "" || user_id === "") {
        return toast.error("Vui lòng nhập đầy đủ thông tin!");
      }

      toast.success("Thêm Tin Tức thành công!");
      // Reset form
      setTitle("");
      setContent("");
      setImage("");
      setUserId("");
      onNewsAdded();
    } catch (e) {
      console.log(e);
    }
  };

  // Lấy danh sách chủ đề
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    const fetchTopics = async () => {
      const result = await AxiosInstance().get("/get-topic.php");
      setTopics(result);
    };

    fetchTopics();
  }, []);

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
          <div className="link-anh">
            <input
              type="text"
              id="image"
              value={image}
              onChange={handleImageChange}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="preview-image" />
            )}
          </div>
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
        <select value={topic_id} onChange={(e) => setTopicId(e.target.value)}>
          {topics.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
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
