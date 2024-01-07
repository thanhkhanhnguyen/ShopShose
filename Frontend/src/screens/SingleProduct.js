import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Rating from "../components/homeComponents/Rating";
import Loading from "../components/LoadingError/Loading";
import {
  createProductReview,
  listProductDetails,
} from "../redux/Actions/ProductActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../redux/Constants/ProductConstants";
import Header from "./../components/Header";
import Message from "./../components/LoadingError/Error";
import Toast from "./../components/LoadingError/Toast";
import { toast } from "react-toastify";
import axios from "axios";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 3000,
};

function getCurrentDateFormatted() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
  const year = currentDate.getFullYear() % 100; // Lấy 2 chữ số cuối cùng của năm

  // Đảm bảo rằng ngày và tháng có dạng 01, 02, ..., 09 khi cần thiết
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Định dạng cuối cùng: dd/mm/yy
  const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

  return formattedDate;
}

const SingleProduct = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const productId = match.params.id;

  const [inQuantity, setInQuantity] = useState(1);
  // console.log("pid", productId);
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingCreateReview,
    error: errorCreateReview,
    success: successCreateReview,
  } = productReviewCreate;

  const [cart, setCart] = useState([]);

  const [reviews, setReviews] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(productId, {
        productId: productId,
        rating,
        content: comment,
      })
    );
  };

  //get review
  const getReviews = async () => {
    const response = await axios.get(
      `http://localhost:5134/api/Comment/product/${productId}`
    );
    // console.log(response?.data);
    setReviews(response?.data || []);
  };

  useEffect(() => {
    getReviews();
  }, [productId, submitHandler]);

  // useEffect(() => {
  //   const fetchDT = async () => {
  //     const rs = await axios.get(`http://localhost:5134/1`);
  //     console.log("fetchData", rs);
  //   };

  //   fetchDT();
  // }, []);

  useEffect(() => {
    if (successCreateReview) {
      toast.success("Review Submitted", ToastObjects);
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(productId));
  }, [dispatch, productId, successCreateReview]);

  const AddToCartHandle = (e) => {
    e.preventDefault();
    history.push(`/cart/${productId}?qty=${qty}`);
  };

  // //handle add to cart into session storage
  // const addToCart = (item) => {
  //   const { id, name, price } = item;
  //   const updatedCart = {
  //     id,
  //     name,
  //     price,
  //     inQuantity,
  //   };
  //   setCart(updatedCart);
  //   sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  // };

  // Assuming `cart` is an array of items in the state
  const addToCart = (item) => {
    const { id, name, price } = item;

    // Retrieve the current cart from sessionStorage
    const existingCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Check if the product with the same ID already exists in the cart
    const existingProduct = existingCart.find((product) => product.id === id);

    if (existingProduct) {
      // If the product exists, update the quantity
      existingProduct.inQuantity += inQuantity * 1;
    } else {
      // If the product doesn't exist, add a new item to the cart
      const newProduct = {
        id,
        name,
        price,
        inQuantity: inQuantity * 1,
      };
      existingCart.push(newProduct);
    }

    // Update the local state and sessionStorage with the modified cart
    setCart(existingCart);
    sessionStorage.setItem("cart", JSON.stringify(existingCart));
  };

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   dispatch(
  //     createProductReview(productId, {

  //       rating,
  //       comment,
  //     })
  //   );
  // };

  return (
    <>
      <Toast />
      <Header />
      <div className="container single-product">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="single-image" style={{ width: "100%" }}>
                  <img src={product?.image} alt={product.name} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                  </div>
                  <p
                    style={{
                      textAlign: "justify",
                      textJustify: "inter-word",
                    }}
                  >
                    {product.description}
                  </p>

                  <div className="product-count col-lg-7 ">
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Price</h6>
                      <span>${product.price}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Status</h6>
                      {product.quantity > 0 ? (
                        <span>In Stock</span>
                      ) : (
                        <span>Unavailable</span>
                      )}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Reviews</h6>

                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </div>
                    {product.quantity > 0 ? (
                      <>
                        <div className="flex-box d-flex justify-content-between align-items-center">
                          <h6>Quantity</h6>
                          {/* <select
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select> */}
                          <input
                            type="number"
                            name="in-quantity"
                            id="in-quantity"
                            value={inQuantity}
                            onChange={(e) => setInQuantity(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="round-black-btn"
                        >
                          Add To Cart
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* RATING */}
            <div className="row my-5">
              <div className="col-md-6">
                <h6 className="mb-3">REVIEWS</h6>
                {/* {product.description.length === 0 && (
                  <Message variant={"alert-info mt-3"}>No Reviews</Message>
                )}
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                  >
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <span>{moment(review.creareAt).calendar()}</span>
                    <div className="alert alert-info mt-3">
                      {review.comment}
                    </div>
                  </div>
                ))} */}

                {false && (
                  <Message variant={"alert-info mt-3"}>No Reviews</Message>
                )}

                <div
                  style={{
                    height: 500,
                    overflowY: "scroll",
                  }}
                >
                  {reviews?.map((rv) => (
                    <div className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded">
                      <strong>{rv?.email}</strong>
                      <Rating value={rv?.rating * 1} />
                      <span>{getCurrentDateFormatted()}</span>
                      <div className="alert alert-info mt-3">{rv?.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-6">
                <h6>WRITE A CUSTOMER REVIEW</h6>
                <div className="my-4">
                  {loadingCreateReview && <Loading />}
                  {errorCreateReview && (
                    <Message variant="alert-danger">
                      {errorCreateReview}
                    </Message>
                  )}
                </div>
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="my-4">
                      <strong>Rating</strong>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                    <div className="my-4">
                      <strong>Comment</strong>
                      <textarea
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      ></textarea>
                    </div>
                    <div className="my-3">
                      <button
                        disabled={loadingCreateReview}
                        className="col-12 bg-black border-0 p-3 rounded text-white"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="my-3">
                    <Message variant={"alert-warning"}>
                      Please{" "}
                      <Link to="/login">
                        " <strong>Login</strong> "
                      </Link>{" "}
                      to write a review{" "}
                    </Message>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SingleProduct;
