import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/AddUsers.css";

Modal.setAppElement("#root"); // Specify the root element for the modal

interface UpdateUsersProps {
  isOpen: boolean;
  onRequestClose: () => void;
  id: number | null;
}

const UpdateUsers = ({ isOpen, onRequestClose, id }) => {
  const [avatar, setAvatar] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [usersDetails, setusersDetails] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    avatar: "",
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
    setAvatar(result.path);
  };

  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setPreviewImage(imageUrl);
    setAvatar(imageUrl); // Cập nhật state 'image' với URL ảnh
  };

  useEffect(() => {
    const fetchusersDetails = async () => {
      const result = await AxiosInstance().get(
        `/get-users-detail.php?id=${id}`
      );

      setusersDetails(result);
      setAvatar(result.image);
      setPreviewImage(result.image);
    };

    if (id) {
      fetchusersDetails();
    }
  }, [isOpen, id]);

  const handleUpdateUsers = async () => {
    try {
      const body = {
        id: id,
        ...usersDetails,
        avatar: avatar,
      };

      await AxiosInstance().put(`/update-users.php`, body);

      // Display a success notification
      toast.success("Cập nhật Người Dùng thành công!");

      // Close the modal
      onRequestClose();
    } catch (e) {
      console.error("Error updating users:", e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cập nhật Người Dùng"
      className="custom-modal"
    >
      <h2>Cập nhật Người Dùng</h2>
      <form>
        <div>
          <label htmlFor="title">Name:</label>
          <input
            type="text"
            id="name"
            value={usersDetails.name}
            onChange={(e) =>
              setusersDetails({ ...usersDetails, name: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="content">Email:</label>
          <input
            id="email"
            value={usersDetails.email}
            onChange={(e) =>
              setusersDetails({ ...usersDetails, email: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="content">Password:</label>
          <input
            id="password"
            value={usersDetails.password}
            onChange={(e) =>
              setusersDetails({ ...usersDetails, password: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="content">Role:</label>
          <input
            id="role"
            value={usersDetails.role}
            onChange={(e) =>
              setusersDetails({ ...usersDetails, role: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="image">Avatar:</label>
          <div className="link-anh">
            <input
              type="text"
              id="avatar"
              value={avatar}
              onChange={handleImageChange}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="preview-image" />
            )}
          </div>
        </div>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy cập nhật
      </button>
      <button className="save-btn" onClick={handleUpdateUsers}>
        Cập nhật
      </button>
      <ToastContainer />
    </Modal>
  );
};

export default UpdateUsers;
