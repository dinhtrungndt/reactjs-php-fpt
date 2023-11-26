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
  const [searchKeyword, setSearchKeyword] = useState(""); // Step 1
  const [filteredNews, setFilteredNews] = useState([]);

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

  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
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

          const feesForStudent = topicsResult.filter(
            (feeItem) => feeItem.student_id === newsItem.id
          );

          const topic = feesForStudent.reduce(
            (total, fee) =>
              total + parseFloat(fee.tuition_fee) + parseFloat(fee.misc_fee),
            0
          );
          return {
            ...newsItem,
            fees_name: topic.toFixed(2),
            user_email: user ? user.email : "Unknown User",
          };
        });

        // Calculate total fees for each student
        const newsWithTotalFees = newsWithUserData.map((student) => {
          const feesForStudent = newsWithUserData.filter(
            (item) => item.user_id === student.user_id
          );
          const totalFees = feesForStudent.reduce(
            (total, fee) => total + parseFloat(fee.fees_name),
            0
          );
          return {
            ...student,
            total_fees: totalFees.toFixed(2),
          };
        });

        setNews(newsWithTotalFees);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredNews(
      news.filter(
        (item) =>
          item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.sbd.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  }, [searchKeyword, news]);

  return (
    <div>
      <Tabs id="controlled-tabs" className="mb-3" variant="pills">
        <Tab eventKey="list">
          <h1>Danh sách học sinh </h1>
          <div className="row">
            <div className="col-12" style={{ marginBottom: 20 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên"
                value={searchKeyword}
                onChange={handleInputChange}
              />
            </div>
          </div>
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
              {filteredNews.map((item, index) => (
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
                  <td>{item.user_email}</td>
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
