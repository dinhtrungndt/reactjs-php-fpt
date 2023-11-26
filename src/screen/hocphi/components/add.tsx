import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AxiosInstance from "../../../helper/AxiosInstance";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/AddUsers.css";

Modal.setAppElement("#root"); // Cần chỉ định một phần tử gốc cho modal
function AddHocPhi({ isOpen, onRequestClose, onNewsAdded, userId }) {
  const [selectAll, setSelectAll] = useState(false);
  const [tuition_fee, setTuitionFee] = useState("");
  const [misc_fee, setMiscFee] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]); // Use an array to track selected students
  const [user_id, setUserId] = useState("");

  const handleSave = async () => {
    try {
      // Check if "Select All" is checked
      const selectedIds = selectAll
        ? students.map((student) => student.id)
        : selectedStudents;

      // Loop through selected students and add fees for each of them
      selectedIds.forEach(async (studentId) => {
        const body = {
          student_id: studentId,
          tuition_fee,
          misc_fee,
          user_id: userId,
        };
        const result = await AxiosInstance().post("/add-hocphi.php", body);
        console.log(result);
      });

      // Vui lòng nhập đầy đủ thông tin
      if (tuition_fee === "" || misc_fee === "") {
        return toast.error("Vui lòng nhập đầy đủ thông tin!");
      }

      // Kiểm tra và đóng modal nếu người dùng được thêm thành công
      toast.success("Thêm học phí thành công!");

      // Reset form
      setTuitionFee("");
      setMiscFee("");
      setSelectAll(false); // Reset "Select All" checkbox
      setSelectedStudents([]); // Reset selected students
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
          {/* Chọn tất cả học sinh */}
          <Form.Group
            className="mb-3"
            controlId="selectAll"
            style={{ marginTop: 10 }}
          >
            <Form.Check
              type="checkbox"
              label="Chọn tất cả học sinh"
              checked={selectAll}
              onChange={() => setSelectAll(!selectAll)}
            />
          </Form.Group>
          {/* Use a select dropdown for the list of students */}
          <Form.Group controlId="selectStudents">
            <Form.Control
              as="select"
              multiple
              disabled={selectAll} // Disable the dropdown if "Select All" is checked
              value={selectedStudents}
              onChange={(e) =>
                setSelectedStudents(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {students.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
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
