import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AxiosInstance from "../../helper/AxiosInstance.js";
import AddUsers from "./components/add.tsx";

function ProfileScreen() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const result = await AxiosInstance().delete(`/delete-users.php?id=${id}`);
      console.log(result);

      // Cập nhật danh sách tin tức sau khi xóa thành công
      setNews((prevNews) => prevNews.filter((item) => item.id !== id));

      // Hiển thị thông báo thành công
      toast.error("Xóa bản tin thành công!");
    } catch (e) {
      console.log(e);

      // Hiển thị thông báo lỗi
      toast.error("Xóa bản tin thất bại!");
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      const result = await AxiosInstance().get("/get-users.php");
      setNews(result);
    };

    fetchNews();
  }, []);
  return (
    <div>
      <Tabs id="controlled-tabs" className="mb-3" variant="pills">
        <Tab eventKey="list">
          <h1>Danh sách người dùng</h1>
          <button onClick={openModal} className="btn btn-primary mb-3 mx-3">
            Thêm người dùng
          </button>
          <AddUsers isOpen={isModalOpen} onRequestClose={closeModal} />

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Avatar</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.password}</td>
                  <td>{item.role}</td>
                  <td>
                    {item.avatar && (
                      <img
                        src={item.avatar}
                        alt={`Ảnh ${item.title}`}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    )}
                  </td>
                  <button className="btn btn-primary mb-1 mx-1">Sửa</button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger mb-1"
                  >
                    Xóa
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        </Tab>
      </Tabs>
      <ToastContainer />
    </div>
  );
}

export default ProfileScreen;
