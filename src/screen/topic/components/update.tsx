import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/AddUsers.css";

Modal.setAppElement("#root"); // Specify the root element for the modal

interface UpdateTopicsProps {
  isOpen: boolean;
  onRequestClose: () => void;
  id: number | null;
}

const UpdateTopics = ({ isOpen, onRequestClose, id }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [usersDetails, setusersDetails] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchNewsDetails = async () => {
      const result = await AxiosInstance().get(
        `/get-topic-detail.php?id=${id}`
      );

      setusersDetails(result);
      setName(result.name);
      setDescription(result.description);
    };

    if (id) {
      fetchNewsDetails();
    }
  }, [isOpen, id]);

  const handleUpdateTopics = async () => {
    try {
      const result = await AxiosInstance().put("/update-topics.php", {
        id: id,
        ...usersDetails,
      });
      console.log(result);
      toast.success("Cập nhật chủ đề thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cập nhật chủ đề"
      className="custom-modal"
    >
      <h2>Cập nhật chủ đề</h2>
      <form>
        <div>
          <label htmlFor="title">Name:</label>
          <input
            id="name"
            value={usersDetails.name}
            onChange={(e) =>
              setusersDetails({ ...usersDetails, name: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="title">Description:</label>
          <input
            id="description"
            value={usersDetails.description}
            onChange={(e) =>
              setusersDetails({ ...usersDetails, description: e.target.value })
            }
          />
        </div>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy cập nhật
      </button>
      <button className="save-btn" onClick={handleUpdateTopics}>
        Cập nhật
      </button>
      <ToastContainer />
    </Modal>
  );
};

export default UpdateTopics;
