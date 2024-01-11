import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "./../redux/Actions/CartActions";
// import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import { getUserName } from "../jwt/decodeJwt";
import axios from "axios";

import { useHistory } from "react-router-dom";
import ItemCart from "../components/ItemCart";

const CartScreen = ({ match, location, history }) => {
  const navigate = useHistory();
  const customStyles = {
    content: {
      height: "auto",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  window.scrollTo(0, 0);
  const dispatch = useDispatch();
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  // const cart = useSelector((state) => state.cart);
  // // const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const [isOnlinePayment, setIsOnlinePayment] = useState(false);

  //1-VNPAY 2-MOMO
  const [destination, setDestination] = useState(1);

  const handleCheckoutMethodChange = (event) => {
    const { checked, id } = event.target;

    if (id === "rdCheckoutOnline" && checked) {
      // Nếu "Thanh Toan Online" được chọn, hiển thị phương thức thanh toán online
      setIsOnlinePayment(true);
    } else {
      // Nếu "Thanh Toan Tien Mat" được chọn, ẩn phương thức thanh toán online
      setIsOnlinePayment(false);
    }
  };

  const handleChoosePaymentOnline = (event) => {
    const { checked, id } = event.target;

    if (id === "rdMethodMoMo" && checked) {
      // Nếu "Thanh Toan Online" được chọn, hiển thị phương thức thanh toán online
      setDestination(2);
    } else {
      // Nếu "Thanh Toan Tien Mat" được chọn, ẩn phương thức thanh toán online
      setDestination(1);
    }
  };

  //handle modal
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const formik = useFormik({
    initialValues: {
      phone: "", // Corrected field name
      address: "",
      note: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Invalid phone number") // Adjust the regex as per your phone number format
        .required("Required"),
      address: Yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      handleCheckout(values);
    },
  });

  const [dataCart, setDataCart] = useState([]);
  const [cartTotal, setCartTotal] = useState([]);
  const [changeItem, setChangeItem] = useState(false);

  useEffect(() => {
    const userLogin = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: "Bearer " + String(userLogin.metadata.accessToken),
      },
    };
    const fetchCart = async () => {
      const response = await axios.get(
        "https://localhost:7296/api/Cart",
        config
      );
      setDataCart(response.data);

      const totalCart = await axios.get(
        "https://localhost:7296/api/Cart/total",
        config
      );
      setCartTotal(totalCart.data);
      dispatch({ type: "UPDATE_NUM_CART", payload: response.data.length });
      sessionStorage.setItem("numCart", JSON.stringify(response.data.length));
    };
    fetchCart();
  }, [changeItem]);

  // const updateCartItemQty = (productId, newQty) => {
  //   console.log(newQty);
  // };
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "totalCart") {
        // Sự kiện được kích hoạt khi totalCart thay đổi trong session storage
        console.log("Total Cart in session storage changed:", event.newValue);

        // Thực hiện các hành động bạn muốn khi totalCart thay đổi
        // Ví dụ: Gửi yêu cầu API để lấy thông tin giỏ hàng mới, cập nhật giao diện, vv.
      }
    };

    // Đăng ký sự kiện lắng nghe thay đổi trong session storage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCheckout = async (values) => {
    const userLogin = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        Authorization: "Bearer " + String(userLogin.metadata.accessToken),
      },
    };

    console.log(userLogin.metadata.accessToken);
    const idUser = getUserName(userLogin.metadata.accessToken);
    // console.log(userLogin);
    if (!isOnlinePayment) {
      const data = {
        paymentContent: `Thanh toán đơn hàng_${idUser}`,
        paymentCurrency: "VND",
        paymentRefId: "ORD1234",
        paymentLanguage: "vn",
        signature: "12345ABCD",
        merchantId: 1,
        paymentDesId: 1,
        phone: values.phone,
        address: values.address,
        note: values.note,
        payMethod: 0,
      };

      const response = await axios.post(
        "https://localhost:7296/api/payment",
        data,
        config
      );

      // console.log(response.data.metadata);
      if (response.data.metadata) {
        navigate.push("/check-out-success");
      }
    } else {
      const data = {
        paymentContent: `Thanh toán đơn hàng_${idUser}`,
        paymentCurrency: "VND",
        paymentRefId: "ORD1234",
        paymentLanguage: "vn",
        signature: "12345ABCD",
        merchantId: 1,
        paymentDesId: destination,
        phone: values.phone,
        address: values.address,
        note: values.note,
        payMethod: 1,
      };

      const response = await axios.post(
        "https://localhost:7296/api/payment",
        data,
        config
      );

      if (response?.status === 200) {
        window.location.href = response.data.metadata.paymentUrl;
      }
      // console.log(response.status);
    }
  };

  return (
    <>
      <Header />
      {/* Cart */}
      <div className="container">
        {dataCart.length === 0 ? (
          <div className=" alert alert-info text-center mt-3">
            Your cart is empty
            <Link
              className="btn btn-success mx-5 px-5 py-3"
              to="/"
              style={{
                fontSize: "12px",
              }}
            >
              SHOPPING NOW
            </Link>
          </div>
        ) : (
          <>
            <div className=" alert alert-info text-center mt-3">
              Total Cart Products
              <Link className="text-success mx-2" to="/cart">
                ({dataCart.length})
              </Link>
            </div>
            {/* cartiterm */}
            {dataCart.map((item, index) => (
              // <div className="cart-iterm row" key={index}>
              //   <div
              //     onClick={() => removeFromCartHandler(item.product)}
              //     className="remove-button d-flex justify-content-center align-items-center"
              //   >
              //     <i className="fas fa-times"></i>
              //   </div>
              //   <div className="cart-image col-md-3">
              //     <img src={item.product.image} alt={item.name} />
              //   </div>
              //   <div className="cart-text col-md-5 d-flex align-items-center">
              //     <Link to={`/products/${item.product}`}>
              //       <h4>{item.product.name}</h4>
              //     </Link>
              //   </div>
              //   <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
              //     <h6>QUANTITY</h6>
              //     <input type="number" value={item.cart.qty} />
              //   </div>
              //   <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
              //     <h6>PRICE</h6>
              //     <h4>${item.product.price}</h4>
              //   </div>
              // </div>
              <ItemCart
                item={item}
                index={index}
                setChangeItem={setChangeItem}
                changeItem={changeItem}
              />
            ))}

            {/* End of cart iterms */}
            <div className="total">
              <span className="sub">total:</span>
              <span className="total-price">${cartTotal}</span>
            </div>
            <hr />
            <div className="cart-buttons d-flex align-items-center row">
              <Link to="/" className="col-md-4 ">
                <button>Continue To Shopping</button>
              </Link>
              {cartTotal > 0 && (
                <div className="col-md-8 d-flex justify-content-md-end mt-3 mt-md-0">
                  <button style={{ width: 300 }} onClick={openModal}>
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2
            className="text-center"
            ref={(_subtitle) => (subtitle = _subtitle)}
          >
            Checkout Info
          </h2>
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                style={{ width: 300 }}
                required
                {...formik.getFieldProps("phone")}
              />
            </div>
            <div className="d-flex">
              {formik.touched.phone && formik.errors.phone ? (
                <p
                  style={{ fontSize: "12px", color: "red" }}
                  className="text-error ms-auto"
                >
                  {formik.errors.phone}*
                </p>
              ) : null}
            </div>
            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                style={{ width: 300 }}
                required
                {...formik.getFieldProps("address")}
              />
            </div>
            <div className="d-flex">
              {formik.touched.address && formik.errors.address ? (
                <p
                  style={{ fontSize: "12px", color: "red" }}
                  className="text-error ms-auto"
                >
                  {formik.errors.address}*
                </p>
              ) : null}
            </div>
            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
              <label htmlFor="">Note:</label>
              <textarea
                style={{ width: 300 }}
                id="note"
                name="note"
                cols="30"
                rows="2"
                {...formik.getFieldProps("note")}
              ></textarea>
            </div>

            <div className="d-flex  align-items-start gap-2 mb-2">
              <label htmlFor="">Payment:</label>
              <div className="me-4 d-flex justify-content-between gap-4">
                <div className="d-flex align-items-center gap-1">
                  <input
                    style={{ marginBottom: 3 }}
                    checked={!isOnlinePayment ? true : false}
                    type="radio"
                    id="rdCheckout"
                    name="rdCheckout"
                    onChange={handleCheckoutMethodChange}
                  />
                  <p>Cash</p>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-1 checkout-online">
                    <input
                      style={{ marginBottom: 3 }}
                      type="radio"
                      id="rdCheckoutOnline"
                      name="rdCheckout"
                      onChange={handleCheckoutMethodChange}
                    />
                    <p>Online</p>
                  </div>
                  {isOnlinePayment && (
                    <div className="ms-3 checkout-online-method">
                      <div className="d-flex">
                        <input
                          checked={destination === 1 ? true : false}
                          type="radio"
                          id="rdMethodVNPay"
                          name="rdMethod"
                          onChange={handleChoosePaymentOnline}
                        />
                        <p>Checkout By VNPay</p>
                      </div>
                      <div className="d-flex">
                        <input
                          checked={destination === 2 ? true : false}
                          type="radio"
                          id="rdMethodMoMo"
                          name="rdMethod"
                          onChange={handleChoosePaymentOnline}
                        />
                        <p>Checkout By Momo</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex ">
              <button
                type="submit"
                style={{ marginTop: 60 }}
                className="mx-auto modal-btn-checkout"
              >
                Check Out
              </button>
            </div>
          </form>
          {/* </Formik> */}
        </Modal>
      </div>
    </>
  );
};

export default CartScreen;
