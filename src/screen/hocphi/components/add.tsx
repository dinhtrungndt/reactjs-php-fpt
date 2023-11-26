import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/AddUsers.css";

Modal.setAppElement("#root"); // Cần chỉ định một phần tử gốc cho modal

function AddHocPhi({ isOpen, onRequestClose, onNewsAdded, userId }) {
  const [student_id, setStudentId] = useState(1);
  const [tuition_fee, setTuitionFee] = useState("");
  const [misc_fee, setMiscFee] = useState("");
  const [user_id, setUserId] = useState("");

  const handleSave = async () => {
    try {
      // Tạo đối tượng FormData chứa dữ liệu người dùng
      const body = {
        student_id,
        tuition_fee,
        misc_fee,
        user_id: userId,
      };
      const result = await AxiosInstance().post("/add-hocphi.php", body);
      console.log(result);

      // Vui lòng nhập đầy đủ thông tin
      if (tuition_fee === "" || misc_fee === "") {
        return toast.error("Vui lòng nhập đầy đủ thông tin!");
      }

      // Kiểm tra và đóng modal nếu người dùng được thêm thành công
      toast.success("Thêm học phí thành công!");

      // Reset form
      setTuitionFee("");
      setMiscFee("");
      onNewsAdded();
    } catch (e) {
      console.log(e);
    }
  };

  // Lấy danh sách học sinh
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const fetchLoaiMonHoc = async () => {
      const result = await AxiosInstance().get("/get-students.php ");
      setStudents(result);
    };

    fetchLoaiMonHoc();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm học phí"
      className="custom-modal"
    >
      <h2>Thêm học phí</h2>
      <form>
        <div>
          <label htmlFor="hocsinh">Tên học sinh:</label>
          <select
            value={student_id}
            onChange={(e) => setStudentId(e.target.value)}
          >
            {students.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hocphi">Học phí:</label>
          <input
            type="text"
            id="hocphi"
            value={tuition_fee}
            onChange={(e) => setTuitionFee(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="hocphi">Phí khác:</label>
          <input
            type="text"
            id="hocphi"
            value={misc_fee}
            onChange={(e) => setMiscFee(e.target.value)}
          />
        </div>
      </form>
      <button className="cancel-btn" onClick={onRequestClose}>
        Hủy thêm học phí
      </button>
      <button className="save-btn" onClick={handleSave}>
        Lưu học phí
      </button>
    </Modal>
  );
}

export default AddHocPhi;
