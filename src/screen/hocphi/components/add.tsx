import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/AddUsers.css";

Modal.setAppElement("#root"); // Cần chỉ định một phần tử gốc cho modal

function AddMonHoc({ isOpen, onRequestClose, onNewsAdded }) {
  const [tenmonhoc, setTenMonHoc] = useState("");
  const [loaimonhoc_id, setloaiMonHoc] = useState(1);

  const handleSave = async () => {
    try {
      // Tạo đối tượng FormData chứa dữ liệu người dùng
      const body = {
        tenmonhoc,
        loaimonhoc_id,
      };
      const result = await AxiosInstance().post("/add-monhoc.php", body);
      console.log(result);

      // Vui lòng nhập đầy đủ thông tin
      if (tenmonhoc === "") {
        return toast.error("Vui lòng nhập đầy đủ thông tin!");
      }

      // Kiểm tra và đóng modal nếu người dùng được thêm thành công
      toast.success("Thêm môn học thành công!");

      // Reset form
      setTenMonHoc("");
      onNewsAdded();
    } catch (e) {
      console.log(e);
    }
  };

  // Lấy danh sách loại môn học
  const [loaiMonHocs, setloaiMonHocs] = useState([]);
  useEffect(() => {
    const fetchLoaiMonHoc = async () => {
      const result = await AxiosInstance().get("/get-loaimonhoc.php ");
      setloaiMonHocs(result);
    };

    fetchLoaiMonHoc();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm môn học"
      className="custom-modal"
    >
      <h2>Thêm môn học</h2>
      <form>
        <div>
          <label htmlFor="monhoc">Tên môn học:</label>
          <input
            type="text"
            id="monhoc"
            value={tenmonhoc}
            onChange={(e) => setTenMonHoc(e.target.value)}
          />
        </div>
        <select
          value={loaimonhoc_id}
          onChange={(e) => setloaiMonHoc(e.target.value)}
        >
          {loaiMonHocs.map((item, index) => (
            <option key={index} value={item.id}>
              {item.tenloaimon}
            </option>
          ))}
        </select>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy thêm môn
      </button>
      <button className="save-btn" onClick={handleSave}>
        Lưu môn học
      </button>
    </Modal>
  );
}

export default AddMonHoc;
