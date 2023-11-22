import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

import AxiosInstance from "../../helper/AxiosInstance.js";
import AddUsers from "./components/add.tsx";
import UpdateUsers from "./components/update.tsx";

function ProfileScreen() {
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

  const handleDelete = async (id) => {
    try {
      swal({
        title: "Bạn muốn xóa người dùng này?",
        text: "Sau khi xóa, bạn sẽ không thể khôi phục người dùng này!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          AxiosInstance().delete(`/delete-users.php?id=${id}`);
          const newNews = news.filter((item) => item.id !== id);
          setNews(newNews);
          toast.success("Xóa người dùng thành công!");
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
    const fetchNews = async () => {
      const result = await AxiosInstance().get("/get-users.php");
      setNews(result);
    };

    fetchNews();
  }, []);

  useEffect(() => {
    setFilteredNews(
      news.filter(
        (item) =>
          item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.email.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  }, [searchKeyword, news]);

  return (
    <div>
      <Tabs id="controlled-tabs" className="mb-3" variant="pills">
        <Tab eventKey="list">
          <h1>Danh sách người dùng</h1>
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
              {filteredNews.map((item, index) => (
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

export default ProfileScreen;
