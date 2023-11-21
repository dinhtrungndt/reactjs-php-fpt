import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/NewsModal.css";

Modal.setAppElement("#root"); // Specify the root element for the modal

interface UpdateNewsProps {
  isOpen: boolean;
  onRequestClose: () => void;
  id: number | null;
}

const UpdateNews = ({ isOpen, onRequestClose, id }) => {
  const [topic_id, setTopicId] = useState(1);
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [newsDetails, setNewsDetails] = useState({
    title: "",
    content: "",
    image: "",
  });

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

  useEffect(() => {
    const fetchNewsDetails = async () => {
      const result = await AxiosInstance().get(`/get-news-detail.php?id=${id}`);

      setNewsDetails(result);
      setTopicId(result.topic_id);
      setImage(result.image);
      setPreviewImage(result.image);
    };

    if (id) {
      fetchNewsDetails();
    }
  }, [isOpen, id]);

  const handleUpdateNews = async () => {
    try {
      const body = {
        id: id,
        ...newsDetails,
        image: image,
        topic_id: topic_id,
      };

      await AxiosInstance().put(`/update-news.php`, body);

      // Display a success notification
      toast.success("Cập nhật Tin Tức thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.error("Error updating news:", e);
    }
  };

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
      contentLabel="Cập nhật Tin Tức"
      className="custom-modal"
    >
      <h2>Cập nhật Tin Tức</h2>
      <form>
        <div>
          <label htmlFor="title">Tiêu đề:</label>
          <input
            type="text"
            id="title"
            value={newsDetails.title}
            onChange={(e) =>
              setNewsDetails({ ...newsDetails, title: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="content">Nội dung:</label>
          <textarea
            id="content"
            value={newsDetails.content}
            onChange={(e) =>
              setNewsDetails({ ...newsDetails, content: e.target.value })
            }
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
        <select value={topic_id} onChange={(e) => setTopicId(e.target.value)}>
          {topics.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy cập nhật
      </button>
      <button className="save-btn" onClick={handleUpdateNews}>
        Cập nhật
      </button>
      <ToastContainer />
    </Modal>
  );
};

export default UpdateNews;
