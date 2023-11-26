import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { Container, Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import "./style.css";
import AxiosInstance from "../helper/AxiosInstance.js";
import ForgotPassword from "./forgot/index.tsx";

function SignInScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { saveUser } = props;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const Login = async () => {
    try {
      const body = { email, password };
      const result = await AxiosInstance().post("/login.php", body);
      console.log(result);
      if (result.status) {
        if (result.user) {
          saveUser(result.user);
        } else {
          alert("Email or password is incorrect");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Thêm sự kiện onSubmit để kiểm tra rememberMe và lưu email/password nếu cần
  const handleSubmit = (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Kiểm tra email
    if (!isEmailValid(email)) {
      setIsEmailInvalid(true);
      isFormValid = false;
    } else {
      setIsEmailInvalid(false);
    }

    // Kiểm tra password
    if (!isPasswordValid(password)) {
      setIsPasswordInvalid(true);
      isFormValid = false;
    } else {
      setIsPasswordInvalid(false);
    }

    if (isFormValid) {
      // Lưu email và password nếu rememberMe được chọn
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      }

      Login();
    }
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length > 0;
  };

  // Thêm sự kiện onChange cho CheckBox để cập nhật trạng thái rememberMe
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center h-100"
    >
      <Row>
        <Col className="login">
          <h2 className="mb-3">My FPT</h2>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                required
                isInvalid={isEmailInvalid}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input" // Thêm class tùy chỉnh
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                isInvalid={isPasswordInvalid}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input" // Thêm class tùy chỉnh
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password.
              </Form.Control.Feedback>
            </Form.Group>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Form.Group className="mb-3" controlId="rememberMe">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="forgotPassword">
                <a
                  onClick={openModal}
                  href="#"
                  style={{ textDecoration: "none", fontSize: 16 }}
                >
                  Forgot password?
                </a>
                <Modal show={isModalOpen} onHide={closeModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ForgotPassword
                      isOpen={isModalOpen}
                      onRequestClose={closeModal}
                      onNewsAdded={() => {}}
                    />
                  </Modal.Body>
                </Modal>
              </Form.Group>
            </div>
            <Button onClick={Login} className="custom-button" type="submit">
              {loading ? "Loading..." : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignInScreen;
