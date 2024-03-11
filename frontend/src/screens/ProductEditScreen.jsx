import { Button, Form } from "react-bootstrap";
import LoaderPause from "../components/LoaderPause";
import Messages from "../components/Messages";
import FormContainer from "../components/FormContainer";
import { updateProduct } from "../actions/productsActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductEditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const {
    error: errorDetails,
    loading: loadingDetails,
    product,
  } = productDetails;

  const productList = useSelector((state) => state.productList);
  const { loading: loadingList, error: errorList, products } = productList;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate;

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    brand: "",
    price: 0,
    category: "",
    description: "",
    countInStock: 0,
  });

  const [uploading, setUploading] = useState(false); // State variable for uploading

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist"); // Use navigate to redirect
    } else {
      if (
        id &&
        products.length > 0 &&
        Object.keys(formData).every((key) => !formData[key])
      ) {
        const editProduct = products.find(
          (product) => product._id === Number(id)
        );
        setFormData(editProduct);
      }
    }
  }, [dispatch, id, successUpdate, navigate, products, formData]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct(formData));
  };

  const uploadFilehandler = async (e) => {
    const file = e.target.files[0]; // Fixed typo here, changed e.target.file to e.target.files
    const formData = new FormData();
    formData.append('image',file);
    formData.append('product_id', file);
    setUploading(true); // Set uploading to true when file uploading starts
    console.log(file)
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization' : `Bearer ${userInfo.token}`
        },
      };
      const { data } = await axios.post("/api/products/upload/", formData, config);
      setImage(data); // This line seems to be redundant, I'm assuming you intended to clear the image state
      setUploading(false); // Set uploading to false when file uploading completes
    } catch (error) {
      setUploading(false); // Set uploading to false if there's an error during file uploading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <LoaderPause />}
        {errorUpdate && <Messages variant="danger">{errorUpdate}</Messages>}
        {loadingDetails ? (
          <LoaderPause />
        ) : errorDetails ? (
          <Messages variant="danger">{errorDetails}</Messages>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Product Name"
                name="name"
                value={formData && formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                className="border"
                type="text"
                placeholder="Image URL"
                name="image"
                value={formData && formData.image}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <input
                id="image-file"
                type="file"
                onChange={uploadFilehandler}
              ></input>
              {uploading && <LoaderPause />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label className="my-2">Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brand"
                name="brand"
                value={formData && formData.brand}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price"
                name="price"
                value={formData && formData.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Category"
                name="category"
                value={formData && formData.category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                name="description"
                value={formData && formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Count In Stock"
                name="countInStock"
                value={formData && formData.countInStock}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="my-2">
              <Button
                type="submit"
                className="btn btn-block"
                variant="primary"
              >
                Update
              </Button>
            </Form.Group>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default ProductEditScreen;
