import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import { login } from "../actions/userActions";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = location.search ? new URLSearchParams(location.search).get("redirect") : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Messages variant="danger">{error}</Messages>}
      {loading && <LoaderPause></LoaderPause>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Row className="my-3">
            <Col>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="marga@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="password">
          <Row className="my-3">
            <Col>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row className="my-3">
            <Col>
              <Button type="submit" variant="primary" className="w-100">
                Sign In
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>

      <Row className="py=3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;
