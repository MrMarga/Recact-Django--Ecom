import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch, useSelector } from "react-redux";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import { Button, Form, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

function UserEditScreen() {
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate(); // Use useNavigate for navigation
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/userlist"); // Use navigate to redirect
    } else {
      if (!user || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId));
        console.log(userId,user._id,)
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, userId, successUpdate, navigate]); // Include navigate in the dependency array

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: userId, name, email, isAdmin }));
  };

  return (
    <div>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <LoaderPause />}
        {errorUpdate && <Messages variant="danger">{errorUpdate}</Messages>}
        {loading ? (
          <LoaderPause />
        ) : error ? (
          <Messages>{error}</Messages>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Row className="my-3">
                <Col>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Marga Singh Ghale"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>

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

            <Form.Group controlId="isAdmin">
              <Row className="my-3">
                <Col>
                  <Form.Label>isAdmin</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="isAdmin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
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
        )}
      </FormContainer>
    </div>
  );
}

export default UserEditScreen;
