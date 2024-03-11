import React, { useEffect } from "react";
import {  LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import { deleteUser, listUser } from "../actions/userActions";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUser());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, successDelete, userInfo]); // Include userInfo in the dependencies array

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure want to delete user")) {
      dispatch(deleteUser(id));
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      // Reset user list state when logging out
      dispatch({ type: 'USER_LIST_RESET' });
    }
  }, [dispatch,successDelete, userInfo,navigate]);

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <LoaderPause />
      ) : error ? (
        <Messages variant="danger">{error}</Messages>
      ) : (
        users && users.length > 0 ? ( // Check if users is defined and not empty
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <i className="fas fa-check" style={{ color: "green" }}></i>
                    ) : (
                      <i className="fas fa-check" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Messages variant="info">No users found.</Messages>
        )
      )}
    </div>
  );
}

export default UserListScreen;
