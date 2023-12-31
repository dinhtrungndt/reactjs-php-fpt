import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AxiosInstance from "../../helper/AxiosInstance.js";
import AddUsers from "./components/add.tsx";
import UpdateUsers from "./components/update.tsx";
import swal from "sweetalert";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import "./style.css";
import AddHocPhi from "./components/add.tsx";

function HocPhiScreen() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [updateModalId, setUpdateModalId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Step 1
  const [filteredNews, setFilteredNews] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

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

  const closeUpdateModal = () => {
    setIsOpenUpdateModal(false);
  };

  const openUpdateModal = (id) => {
    setIsOpenUpdateModal(true);
    setUpdateModalId(id);
  };

  const handleDelete = async (id) => {
    try {
      swal({
        title: "Bạn muốn xóa môn học này?",
        text: "Sau khi xóa, bạn sẽ không thể khôi phục môn học này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          AxiosInstance().delete(`/delete-hocphi.php?id=${id}`);
          const newNews = news.filter((item) => item.id !== id);
          setNews(newNews);
          toast.success("Xóa môn học thành công!");
        } else {
          toast.error("Bạn đã hủy xóa!");
        }
      });
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
          AxiosInstance().get("/get-fees.php"),
          AxiosInstance().get("/get-users.php"),
          AxiosInstance().get("/get-students.php"),
        ]);

        const newsWithUserData = newsResult.map((newsItem) => {
          const user = usersResult.find(
            (userItem) => userItem.id === newsItem.student_id
          );
          const topic = topicsResult.find(
            (topicItem) => topicItem.id === newsItem.user_id
          );
          return {
            ...newsItem,
            students_name: user ? user.name : "Unknown Topic",
            user_name: topic ? topic.email : "Unknown User",
          };
        });

        setNews(newsWithUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    setFilteredNews(
      news.filter(
        (item) =>
          item.students_name
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          item.user_name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  }, [searchKeyword, news]);

  const handleSort = () => {
    const sortedNews = [...filteredNews].sort((a, b) => {
      const tuitionA = parseFloat(a.tuition_fee);
      const tuitionB = parseFloat(b.tuition_fee);

      if (sortOrder === "asc") {
        return tuitionA - tuitionB;
      } else {
        return tuitionB - tuitionA;
      }
    });

    setFilteredNews(sortedNews);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      <Tabs id="controlled-tabs" className="mb-3" variant="pills">
        <Tab eventKey="list">
          <h1>Danh sách học phí </h1>
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
            Thêm học phí
          </button>
          <button
            onClick={handleSort}
            className="btn btn-secondary"
            style={{
              backgroundColor: "#fff",
              color: "#000",
              borderColor: "#000",
              marginTop: -15,
              transition: "background-color 0.3s",
              cursor: "pointer",
            }}
          >
            {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
          </button>
          <AddHocPhi
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            userId={user ? user.id : null}
            onNewsAdded={() => {}}
          />

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên học sinh</th>
                <th>Học phí</th>
                <th>Phí phát sinh</th>
                <th>Ngày tạo</th>
                <th>Người tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.students_name}</td>
                  <td>{item.tuition_fee}</td>
                  <td>{item.misc_fee}</td>
                  <td>{item.created_at}</td>
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

export default HocPhiScreen;
