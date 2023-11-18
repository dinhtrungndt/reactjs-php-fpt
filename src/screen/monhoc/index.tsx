import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AxiosInstance from "../../helper/AxiosInstance.js";
import AddUsers from "./components/add.tsx";
import UpdateUsers from "./components/update.tsx";
import AddMonHoc from "./components/add.tsx";
import swal from "sweetalert";

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
          AxiosInstance().delete(`/delete-monhoc.php?id=${id}`);
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
        const [newsResult, topicsResult] = await Promise.all([
          AxiosInstance().get("/get-monhoc.php"),
          AxiosInstance().get("/get-loaimonhoc.php"), // Chỉnh sửa endpoint nếu cần
        ]);

        const newsWithUserData = newsResult.map((newsItem) => {
          const topic = topicsResult.find(
            (topicItem) => topicItem.id === newsItem.monhoc_id
          );
          const loaimonhoc = topicsResult.find(
            (loaimonhocItem) => loaimonhocItem.id === newsItem.loaimonhoc_id
          );
          return {
            ...newsItem,
            loaimonhoc_name: loaimonhoc
              ? loaimonhoc.tenloaimon
              : "Unknown Type",
            monhoc_name: topic ? topic.tenmonhoc : "Unknown Topic",
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
          <AddMonHoc
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            onNewsAdded={() => {}}
          />

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
                  <td>{item.tenmonhoc}</td>
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
