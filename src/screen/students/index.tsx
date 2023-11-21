import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AxiosInstance from "../../helper/AxiosInstance.js";
import AddUsers from "./components/add.tsx";
import UpdateUsers from "./components/update.tsx";

function StudentScreen() {
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
    const fetchData = async () => {
      try {
        const [newsResult, topicsResult, usersResult] = await Promise.all([
          AxiosInstance().get("/get-students.php"),
          AxiosInstance().get("/get-fees.php"),
          AxiosInstance().get("/get-users.php"),
        ]);

        const newsWithUserData = newsResult.map((newsItem) => {
          const user = usersResult.find(
            (userItem) => userItem.id === newsItem.user_id
          );
          const topic = topicsResult.find(
            (topicItem) => topicItem.id === newsItem.fees_id
          );
          return {
            ...newsItem,
            fees_name: topic ? topic.tuition_fee : "Unknown Topic",
            user_name: user ? user.name : "Unknown User",
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
          <h1>Danh sách học sinh </h1>
          <button onClick={openModal} className="btn btn-primary mb-3 mx-3">
            Thêm học sinh
          </button>
          <AddUsers isOpen={isModalOpen} onRequestClose={closeModal} />

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên học sinh</th>
                <th>Tuổi</th>
                <th>SBD</th>
                <th>Avatar</th>
                <th>Phí</th>
                <th>Người thêm</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.sbd}</td>
                  <td>
                    {" "}
                    {item.avatar && (
                      <img
                        src={item.avatar}
                        alt={`Ảnh ${item.title}`}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    )}
                  </td>
                  <td>{item.fees_name}</td>
                  <td>{item.user_name}</td>
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

export default StudentScreen;
