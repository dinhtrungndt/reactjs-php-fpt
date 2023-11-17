import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import NewsModal from "./component/add-news.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosInstance from "../../helper/AxiosInstance.js";
import LichHocScreen from "../lichhoc/index.tsx";
import BangDiemScreen from "../bangdiem/bangdiem.tsx";
import ProfileScreen from "../profile/index.tsx";
import UpdateNews from "./component/update-news.tsx";

import "./css/style.css";

function NewsScreen() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [updateModalId, setUpdateModalId] = useState(null);

  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  };

  const user = getUserFromLocalStorage();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openUpdateModal = (id) => {
    setIsOpenUpdateModal(true);
    setUpdateModalId(id);
  };

  const closeUpdateModal = () => {
    setIsOpenUpdateModal(false);
  };

  const handleDelete = async (id) => {
    try {
      const result = await AxiosInstance().delete(`/delete-news.php?id=${id}`);
      console.log(result);

      // Cập nhật danh sách tin tức sau khi xóa thành công
      const newNews = news.filter((item) => item.id !== id);
      setNews(newNews);

      // Hiển thị thông báo thành công
      toast.error("Xóa bản tin thành công!");
    } catch (e) {
      console.log(e);

      // Hiển thị thông báo lỗi
      toast.error("Xóa bản tin thất bại!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResult, topicsResult, usersResult] = await Promise.all([
          AxiosInstance().get("/get-news.php"),
          AxiosInstance().get("/get-topic.php"),
          AxiosInstance().get("/get-users.php"), // Adjust the endpoint based on your API
        ]);

        const newsWithUserData = newsResult.map((newsItem) => {
          const topic = topicsResult.find(
            (topicItem) => topicItem.id === newsItem.topic_id
          );
          const user = usersResult.find(
            (userItem) => userItem.id === newsItem.user_id
          );
          return {
            ...newsItem,
            topic_name: topic ? topic.name : "Unknown Topic",
            user_email: user ? user.email : "Unknown User",
          };
        });

        setNews(newsWithUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="
    container-fluid
    "
    >
      <Tabs id="controlled-tabs" className="mb-3 mt-4" variant="pills">
        <Tab eventKey="list" title="Tin tức">
          <h1>Danh sách tin tức</h1>
          <button onClick={openModal} className="btn btn-primary mb-3 mx-3">
            Thêm Tin Tức
          </button>
          <NewsModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            userId={user ? user.id : null}
            onNewsAdded={() => {}}
          />

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Nội dung</th>
                <th>Hình ảnh</th>
                <th>Ngày tạo</th>
                <th>Người tạo</th>
                <th>Chủ đề</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.content}</td>
                  <td>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={`Ảnh ${item.title}`}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    )}
                  </td>
                  <td>{item.created_at}</td>
                  <td>{item.user_email}</td>
                  <td>{item.topic_name}</td>
                  <button
                    className="btn btn-primary mb-1 mx-1"
                    onClick={() => openUpdateModal(item.id)}
                  >
                    Sửa
                  </button>
                  <UpdateNews
                    isOpen={isOpenUpdateModal}
                    onRequestClose={closeUpdateModal}
                    id={updateModalId}
                  />

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
        <Tab eventKey="lichhoc" title="Lịch học">
          <LichHocScreen />
        </Tab>
        <Tab eventKey="bangdiem" title="Bảng điểm">
          <BangDiemScreen />
        </Tab>
        <Tab eventKey="profile" title="Hồ sơ">
          <ProfileScreen />
        </Tab>
      </Tabs>
      <ToastContainer />
    </div>
  );
}

export default NewsScreen;
