import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import NewsModal from "./component/add-news.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosInstance from "../../helper/AxiosInstance.js";
import LichHocScreen from "../lichhoc/index.tsx";
import ProfileScreen from "../profile/index.tsx";
import UpdateNews from "./component/update-news.tsx";
import swal from "sweetalert";

import "./css/style.css";
import MonHocScreen from "../monhoc/index.tsx";
import TopicScreen from "../topic/index.tsx";
import UpdateUsers from "../profile/components/update.tsx";
import ChartJS from "../chartjs/index.js";
import ChartComponent from "../chartjs/index.js";
import StudentScreen from "../students/index.tsx";
import HocPhiScreen from "../hocphi/index.tsx";

function NewsScreen() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [updateModalId, setUpdateModalId] = useState(null);
  const [isOpenUpdateUser, setIsOpenUpdateUser] = useState(false);
  const [updateUserModalId, setUpdateUserModalId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Step 1
  const [filteredNews, setFilteredNews] = useState([]);

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
    toast.error("Bạn đã hủy thêm!");
  };

  const openUpdateModal = (id) => {
    setIsOpenUpdateModal(true);
    setUpdateModalId(id);
  };

  const closeUpdateModal = () => {
    setIsOpenUpdateModal(false);
    toast.error("Bạn đã hủy cập nhập!");
  };

  const openUpdateUser = (id) => {
    setIsOpenUpdateUser(true);
    setUpdateUserModalId(id);
  };

  const closeUpdateUser = () => {
    setIsOpenUpdateUser(false);
    window.location.reload();
  };

  const handleDelete = async (id) => {
    try {
      swal({
        title: "Bạn muốn xóa tin tức này?",
        text: "Sau khi xóa, bạn sẽ không thể khôi phục tập tin tưởng tượng này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          AxiosInstance().delete(`/delete-news.php?id=${id}`);
          // Cập nhật danh sách tin tức sau khi xóa thành công
          const newNews = news.filter((item) => item.id !== id);
          setNews(newNews);
          toast.success("Xóa bản tin thành công!");
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

  const handleSearch = async () => {
    try {
      const response = await AxiosInstance().get(
        `/search-news.php?keyword=${searchKeyword}`
      );
      setFilteredNews(response.data); // Step 2
    } catch (error) {
      console.error("Error searching news:", error);
    }
  };

  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResult, topicsResult, usersResult] = await Promise.all([
          AxiosInstance().get("/get-news.php"),
          AxiosInstance().get("/get-topic.php"),
          AxiosInstance().get("/get-users.php"),
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

  useEffect(() => {
    setFilteredNews(
      news.filter(
        (item) =>
          item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.content.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  }, [searchKeyword, news]);

  return (
    <div
      className="
    container-fluid
    "
    >
      {/* ảnh user */}
      <div className="row">
        <div className="col-12"></div>
      </div>
      {/* Hiện 'Hello user' người dùng và to màu tên user */}
      <h4 className="text-center mt-3">
        Xin chào{" "}
        <span
          onClick={() => openUpdateUser(user.id)}
          style={{ cursor: "pointer" }}
          className="text-danger"
        >
          {user ? user.email : "Unknown User"}
          <img
            src={user.avatar}
            style={{
              width: "50px",
              height: "50px",
              border: "1px solid black",
              borderWidth: 1,
              borderRadius: "50%",
              marginLeft: "10px",
            }}
          />
          {isOpenUpdateModal || (
            <UpdateUsers
              isOpen={isOpenUpdateUser}
              onRequestClose={closeUpdateUser}
              id={updateModalId}
            />
          )}
        </span>
      </h4>
      <h1 className="text-center mt-3">Trang quản trị</h1>
      <hr />
      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.reload();
        }}
        className="btn btn-danger mb-2 mx-3 my-3"
        style={{ position: "absolute", right: "100px", top: "10px" }}
      >
        Đăng xuất
      </button>
      <Tabs id="controlled-tabs" className="mb-3 mt-4" variant="pills">
        <Tab eventKey="list" title="Tin tức">
          <h1>Danh sách tin tức</h1>
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
              {filteredNews.map((item, index) => (
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
        <Tab eventKey="topic" title="Chủ đề">
          <TopicScreen />
        </Tab>
        <Tab eventKey="monhoc" title="Môn học">
          <MonHocScreen />
        </Tab>
        <Tab eventKey="lichhoc" title="Lịch học">
          <LichHocScreen />
        </Tab>
        <Tab eventKey="profile" title="Hồ sơ">
          <ProfileScreen />
        </Tab>
        <Tab eventKey="student" title="Học sinh">
          <StudentScreen />
        </Tab>
        <Tab eventKey="hocphi" title="Học phí">
          <HocPhiScreen />
        </Tab>
        <Tab eventKey="chart" title="Biểu đồ">
          <ChartComponent />
        </Tab>
      </Tabs>

      <ToastContainer />
    </div>
  );
}

export default NewsScreen;
