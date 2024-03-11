import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";


function ShippingScreen() {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    
    const dispatch = useDispatch()

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address,city,postalCode,country}))
        window.location.href ='/payment'
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2  />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="address">
                    <Row className="my-3">
                        <Col>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Enter Address"
                                value={address ? address : ''}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId="city">
                    <Row className="my-3">
                        <Col>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Marga Ghale"
                                value={city ? city : ''}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId="Postal Code">
                    <Row className="my-3">
                        <Col>
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="+41100"
                                value={postalCode ? postalCode : ''}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId="country">
                    <Row className="my-3">
                        <Col>
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Nepal"
                                value={country ? country : ''}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Row className="my-3">
                        <Col>
                            <Button type="submit" variant="primary" className="w-100">
                                Continue
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
