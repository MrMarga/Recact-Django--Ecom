import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import {  getUserDetails, updateUserProfile } from "../actions/userActions";
import { Row, Col, Button, Form, Table } from "react-bootstrap";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import { deleteOrder, listMyOrders } from "../actions/orderActions";
import { LinkContainer } from "react-router-bootstrap";


function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  const location = useLocation();
  const redirect = location.search ? new URLSearchParams(location.search).get("redirect") : "/login";

  const orderDelete = useSelector((state) => state.orderDelete);
  const { success: successDelete } = orderDelete;

  useEffect(() => {
    if (!userInfo) {
      navigate(redirect);
    } else {
      if (!user || !user.name || success || userInfo.id !== user.id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userInfo, user, success, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure want to delete this order.?")) {
      dispatch(deleteOrder(id));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      setMessage("Passwords do not match");
    } else {
      console.log("Passwords match");
      dispatch(
        updateUserProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      );
      setMessage("");
    }
  };

  useEffect(() => {
    if (successDelete) {
      dispatch(listMyOrders());
    }
  }, [dispatch, successDelete]);

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {error && !message && <Messages variant="danger">{error}</Messages>}
        {message && <Messages variant="danger">{message}</Messages>}
        {loading && <LoaderPause></LoaderPause>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Row className="my-3">
              <Col>
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="name" placeholder="Marga Singh Ghale" value={name} onChange={(e) => setName(e.target.value)} />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="email">
            <Row className="my-3">
              <Col>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="marga@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="password">
            <Row className="my-3">
              <Col>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="passwordConfirm">
            <Row className="my-3">
              <Col>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group>
            <Row className="my-3">
              <Col>
                <Button type="submit" variant="primary" className="w-100">
                  Update
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <LoaderPause />
        ) : errorOrders ? (
          <Messages variant="danger">{errorOrders}</Messages>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : <i className="fas fa-times" style={{ color: "red" }}></i>}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm">Details</Button>
                    </LinkContainer>
                  </td>
                  <td>
                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(order._id)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;
