import React, { useEffect } from "react";
import {  LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import {  listOrders } from "../actions/orderActions";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function OrderListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo]); // Include userInfo in the dependencies array

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      // Reset user list state when logging out
      dispatch({ type: 'USER_LIST_RESET' });
    }
  }, [dispatch, userInfo,navigate]);

  return (
    <div>
      <h1>Order List</h1>
      {loading ? (
        <LoaderPause />
      ) : error ? (
        <Messages variant="danger">{error}</Messages>
      ) : (
        orders && orders.length > 0 ? ( // Check if orders is defined and not empty
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>Total</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>$ {order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                    ):( 
                    <i className="far fa-thumbs-down" style={{ color: "red" }}></i>
                    )}
                  </td>
                <td>
                  {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10))
                    :( 
                    <i className="far fa-thumbs-down" style={{ color: "red" }}></i>
                    )}
                  </td>
                  
                  <td>
                    <LinkContainer to={`/order/${order._id}/`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Messages variant="info">No orders found.</Messages>
        )
      )}
    </div>
  );
}

export default OrderListScreen;
