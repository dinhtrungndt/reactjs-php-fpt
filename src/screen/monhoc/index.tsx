import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AxiosInstance from "../../helper/AxiosInstance.js";
import AddUsers from "./components/add.tsx";
import UpdateUsers from "./components/update.tsx";

function MonHocScreen() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [updateModalId, setUpdateModalId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeUpdateModal = () => {
    setIsOpenUpdateModal(false);
  };

  const openUpdateModal = (id) => {
    setIsOpenUpdateModal(true);
    setUpdateModalId(id);
  };

  useEffect(() => {
    const fetchNews = async () => {
      const result = await AxiosInstance().get("/get-monhoc.php");
      setNews(result);
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResult, topicsResult, usersResult] = await Promise.all([
          AxiosInstance().get("/get-lichhoc.php"),
          AxiosInstance().get("/get-monhoc.php"),
          AxiosInstance().get("/get-loaimonhoc.php"), // Adjust the endpoint based on your API
        ]);

        const newsWithUserData = newsResult.map((newsItem) => {
          const loaimonhoc = usersResult.find(
            (userItem) => userItem.id === newsItem.user_id
          );
          const topic = topicsResult.find(
            (topicItem) => topicItem.id === newsItem.monhoc_id
          );
          return {
            ...newsItem,
            monhoc_name: topic ? topic.tenmonhoc : "Unknown Topic",
            loaimonhoc_name: loaimonhoc
              ? loaimonhoc.tenloaimon
              : "Unknown Topic",
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
    <div>
      <Tabs id="controlled-tabs" className="mb-3" variant="pills">
        <Tab eventKey="list">
          <h1>Danh sách môn học </h1>
          <button onClick={openModal} className="btn btn-primary mb-3 mx-3">
            Thêm môn học
          </button>
          <AddUsers isOpen={isModalOpen} onRequestClose={closeModal} />

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên môn học</th>
                <th>Loại môn học</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.monhoc_name}</td>
                  <td>{item.loaimonhoc_name}</td>
                  <button
                    className="btn btn-primary mb-1 mx-1"
                    onClick={() => openUpdateModal(item.id)}
                  >
                    Sửa
                  </button>
                  <UpdateUsers
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
      </Tabs>
      <ToastContainer />
    </div>
  );
}

export default MonHocScreen;
