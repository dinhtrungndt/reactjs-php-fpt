import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import NewsModal from "./component/add-news.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosInstance from "../../helper/AxiosInstance.js";
import LichHocScreen from "../lichhoc/index.tsx";
import BangDiemScreen from "../bangdiem/bangdiem.tsx";
import ProfileScreen from "../profile/index.tsx";

function NewsScreen() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // Thêm state để lưu thông tin bản tin cần cập nhật
  const [updateNews, setUpdateNews] = useState({
    id: null,
    title: "",
    content: "",
    image: "",
    user_id: "",
    topic_id: "",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    const fetchNews = async () => {
      const result = await AxiosInstance().get("/get-news.php");
      setNews(result);
    };

    fetchNews();
  }, []);

  return (
    <div>
      <Tabs id="controlled-tabs" className="mb-3 mt-4" variant="pills">
        <Tab eventKey="list" title="Tin tức">
          <h1>Danh sách tin tức</h1>
          <button onClick={openModal} className="btn btn-primary mb-3 mx-3">
            Thêm Tin Tức
          </button>
          <NewsModal isOpen={isModalOpen} onRequestClose={closeModal} />

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
                  <td>{item.user_id}</td>
                  <td>{item.topic_id}</td>
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
