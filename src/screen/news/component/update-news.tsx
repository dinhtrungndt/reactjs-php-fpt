import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/NewsModal.css";

Modal.setAppElement("#root"); // Cần chỉ định một phần tử gốc cho modal

const UpdateNews = ({ isOpen, onRequestClose, id }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [user_id, setUserId] = useState("");
  const [topic_id, setTopicId] = useState("");

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await AxiosInstance().get(`/get-news.php?id=${id}`);
        const newsItem = response.data;

        setTitle(newsItem.title);
        setContent(newsItem.content);
        setImage(newsItem.image);
        setUserId(newsItem.user_id);
        setTopicId(newsItem.topic_id);
      } catch (error) {
        console.log(error);
      }
    };

    if (isOpen && id) {
      fetchNewsItem();
    }
  }, [isOpen, id]);

  const handleUpdateNews = async () => {
    try {
      const body = { title, content, image, user_id, topic_id };
      await AxiosInstance().put(`/update-news.php?id=${id}`, body);

      // Hiển thị thông báo thành công
      toast.success("Cập nhập Tin Tức thành công!");

      // Fetch updated data after successful update
      const updatedResponse = await AxiosInstance().get("/get-news.php");
      const updatedData = updatedResponse.data; // Assuming the data is in the 'data' property

      // Close the modal first
      onRequestClose();

      // Find the updated news item based on the provided id
      const updatedNewsItem = updatedData.find((item) => item.id === id);

      // Clear the form fields
      setTitle("");
      setContent("");
      setImage("");
      setUserId("");
      setTopicId("");

      // Hiện thông tin của id vào trong form
      setTitle(updatedNewsItem.title);
      setContent(updatedNewsItem.content);
      setImage(updatedNewsItem.image);
      setUserId(updatedNewsItem.user_id);
      setTopicId(updatedNewsItem.topic_id);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cập nhập Tin Tức"
      className="custom-modal"
    >
      <h2>Cập nhập Tin Tức</h2>
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
        Hủy cập nhập
      </button>
      <button className="save-btn" onClick={handleUpdateNews}>
        Cập nhập
      </button>
    </Modal>
  );
};

export default UpdateNews;
