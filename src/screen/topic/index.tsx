import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AxiosInstance from "../../helper/AxiosInstance.js";
import AddUsers from "./components/add.tsx";
import UpdateUsers from "./components/update.tsx";
import AddMonHoc from "./components/add.tsx";
import swal from "sweetalert";
import AddChuDe from "./components/add.tsx";
import UpdateTopics from "./components/update.tsx";

function TopicScreen() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [updateModalId, setUpdateModalId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    toast.error("Bạn đã hủy thêm chủ đề!");
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
        title: "Bạn muốn xóa chủ đề này?",
        text: "Sau khi xóa, bạn sẽ không thể khôi phục chủ đề này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          AxiosInstance().delete(`/delete-topic.php?id=${id}`);
          const newNews = news.filter((item) => item.id !== id);
          setNews(newNews);
          toast.success("Xóa chủ đề thành công!");
        } else {
          toast.error("Bạn đã hủy xóa!");
        }
      });
    } catch (e) {
      console.log(e);

      // Hiển thị thông báo lỗi
      toast.error("Xóa chủ đề thất bại!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await AxiosInstance().get("/get-topic.php");
      setNews(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Tabs id="controlled-tabs" className="mb-3" variant="pills">
        <Tab eventKey="list">
          <h1>Danh sách chủ đề </h1>
          <button onClick={openModal} className="btn btn-primary mb-3 mx-3">
            Thêm chủ đề
          </button>
          <AddChuDe
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            onNewsAdded={() => {}}
          />

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên chủ đề</th>
                <th>Miêu tả</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <button
                    className="btn btn-primary mb-1 mx-1"
                    onClick={() => openUpdateModal(item.id)}
                  >
                    Sửa
                  </button>
                  <UpdateTopics
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

export default TopicScreen;
