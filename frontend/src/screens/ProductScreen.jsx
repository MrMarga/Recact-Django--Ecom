import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { listProductsDetails , createProductReview } from "../actions/productsActions";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

function ProductScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating,setRating] = useState(0);
  const [comment,setComment] = useState(0);
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { 
    loading:loadingReviewCreate, 
    success:successReviewCreate, 
    error:errorReviewCreate} = productReviewCreate;

  useEffect(() => {
    if(successReviewCreate){
      setRating(0)
      setComment('')
      dispatch({type : PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductsDetails(id));

  }, [dispatch, useParams(),successReviewCreate]);

  const addTOCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitHandler =  (e) =>{
     e.preventDefault()
     dispatch( createProductReview (id,{rating,comment}))
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <LoaderPause />
      ) : error ? (
        <Messages variant="danger">{error}</Messages>
      ) : (

        <div>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews}Reviews`}
                  color={"#F9A602"}
                ></Rating>
              </ListGroup.Item>

              <ListGroup.Item>Price : $ {product.price}</ListGroup.Item>

              <ListGroup.Item>
                Description : {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Row>
                    <Button
                      onClick={addTOCartHandler}
                      className="btn-block"
                      disabled={
                        !userInfo ||
                        userInfo === null ||
                        product.countInStock === 0
                      }
                      type="button"
                    >
                      Add to Cart
                    </Button>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>

            <Row>
                <Col md={6}>
                  <h3>REVIEWS</h3>
                  {product.reviews && product.reviews.length === 0 && <Messages variant='info'>No Reviews</Messages>}
                  <ListGroup variant='flush'>
                    {product.reviews && product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} color='#f8e825'></Rating>
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    )
                    )}
                    <ListGroup.Item>
                      <h4>Write a Review</h4>
                      {loadingReviewCreate && <LoaderPause/>}
                      {successReviewCreate && <Messages variant='success'>Review Submitted</Messages>}
                      {errorReviewCreate && <Messages variant='danger'>{errorReviewCreate}</Messages>}
                      {userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                              as='select'
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >Rating
                              <option value=' '> Select... </option>
                              <option value='1'>1 - Poor</option>
                              <option value='2'>2 - Fair</option>
                              <option value='3'>3 - Good</option>
                              <option value='4'>4 - Very Good</option>
                              <option value='5'>5 - Excellent</option>

                            </Form.Control>
                          </Form.Group>

                          <Form.Group content="comment">
                               <Form.Label>Review</Form.Label>
                               <Form.Control
                                    as='textarea'
                                    row='5'
                                    value={comment} 
                                    onChange={(e)=>setComment(e.target.value)}
                               ></Form.Control>
                          </Form.Group>

                          <Form.Group className="my-2">
                        
                            <Button  disabled={loadingReviewCreate}
                          type="submit" variant="primary">
                            Submit
                          </Button>
                          </Form.Group>
                         
                        </Form>
                      ) : (
                        <Messages variant='info'>Please <Link className='text-link' to='/login'><strong>login</strong></Link> to write a review.</Messages>
                      )}

                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>

        </div>
      )}
    </div>
  );
}

export default ProductScreen;
