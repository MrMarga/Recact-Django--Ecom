import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import { register } from "../actions/userActions";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";


function RegisterScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
      
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
  
    const redirect = location.search ? new URLSearchParams(location.search).get("redirect") : "/login";
  
    const userRegister = useSelector((state) => state.userRegister)
    const { error, loading, userInfo } = userRegister
  
    useEffect(() => {
      if (userInfo) {
        navigate(redirect)
      }
    }, [navigate, userInfo, redirect]);
  
    const submitHandler = (e) => {
      e.preventDefault();

      if (password != confirmPassword){
        setMessage('Password do not match')
      }

      dispatch(register(name, email, password))
      setMessage('')
    }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Messages variant="danger">{message}</Messages>}
      {error && <Messages variant="danger">{error}</Messages>}
      {loading && <LoaderPause></LoaderPause>}
      <Form onSubmit={submitHandler}>

      <Form.Group controlId="name">
          <Row className="my-3">
            <Col>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="name"
                required
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
                required
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
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="passwordConfirm">
          <Row className="my-3">
            <Col>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row className="my-3">
            <Col>
              <Button type="submit" variant="primary" className="w-100">
                Register
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>

      <Row className="py=3">
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Sign In</Link>
        </Col>
      </Row>
  
    </FormContainer>
  )
}

export default RegisterScreen
