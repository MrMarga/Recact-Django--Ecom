import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, ListGroup, Image, Card, Button } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import Messages from '../components/Messages';
import LoaderPause from '../components/LoaderPause';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { PayPalButton } from 'react-paypal-button-v2';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

function OrderScreen() {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();
    const [sdkReady, setSdkReady] = useState(false);

    const { order, error, loading } = useSelector(state => state.orderDetails);

    const { loading: loadingPay, success: successPay } = useSelector(state => state.orderPay);

    const { loading: loadingDeliver, success: successDeliver } = useSelector(state => state.orderDeliver);

    const { userInfo } = useSelector(state => state.userLogin);

    useEffect(() => {
        const orderIdNumber = Number(orderId);
        dispatch(getOrderDetails(orderIdNumber));
    }, [dispatch, orderId]);

    useEffect(() => {
        const orderIdNumber = Number(orderId);
        if (successPay) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrderDetails(orderIdNumber));
        }
    }, [dispatch, orderId, successPay]);

    useEffect(() => {
        const orderIdNumber = Number(orderId);
        if (!order || successPay || order._id !== orderIdNumber || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(getOrderDetails(orderIdNumber));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [dispatch, orderId, order, successPay, successDeliver]);

    const addPayPalScript = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "https://www.paypal.com/sdk/js?client-id=AaxpnEFvEaUH3WuH9YYT_qvTy1rNlfe69N7E1ibZ4K2vYTrTUotLz-ujsO_fZ7j-BSIJ9M3njkFxsS5b";
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    }

    if (!loading && !error && order && order.orderItems) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    }


    return (
        <div>
            <h1>Order: {orderId}</h1>
            <CheckoutSteps step1 step2 step3 step4 />
            {loading ? (
                <LoaderPause />
            ) : error ? (
                <Messages variant="danger">{error}</Messages>
            ) : (
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p><strong>Name : {order.user && order.user.name}</strong></p>
                                <p><strong>Email : <a className='text-link' href={`mailto:${order.user && order.user.email}`}>{order.user && order.user.email}</a></strong></p>
                                {order && order.shippingAddress && (
                                    <p>
                                        <strong>Shipping : </strong>
                                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                    </p>
                                )}
                                {order.isDelivered ? (
                                    <Messages variant='success'>Delivered on {order.deliveredAt.substring(0,10)}</Messages>
                                ) : (
                                    <Messages variant='warning'>Not Delivered</Messages>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method : </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Messages variant='success'>Paid on {order.paidAt.substring(0, 10)}</Messages>
                                ) : (
                                    <Messages variant='warning'>Not Paid</Messages>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order && order.orderItems && order.orderItems.length === 0 ? (
                                    <Messages variant="info">Your Order is empty</Messages>
                                ) : (
                                    <ListGroup variant="flush">
                                        {order && order.orderItems && order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={2}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link className="item-link" to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} * {item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card className="my-4">
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items:</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping:</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax:</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total:</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {!order.isPaid && !loadingPay && sdkReady && (
                                    <ListGroup.Item>
                                        {!sdkReady ? (
                                            <LoaderPause /> // Show loader if SDK is not ready
                                        ) : (
                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                        )}
                                    </ListGroup.Item>
                                )}
                                     
                            {loadingDeliver && <LoaderPause/>}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Row>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}>Mark as Delivered</Button>
                                        </Row>    
                                    </ListGroup.Item>
                                )}
                            </ListGroup>

                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default OrderScreen;
