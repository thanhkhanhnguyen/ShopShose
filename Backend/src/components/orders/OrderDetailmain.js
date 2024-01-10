import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  deliveredOrder,
  getOrderDetails,
} from "./../../redux/Actions/OrderActions";
import Message from "./../LoadingError/Error";
import Loading from "./../LoadingError/Loading";
import OrderDetailInfo from "./OrderDetailInfo";
import OrderDetailProducts from "./OrderDetailProducts";
import moment from "moment";
import Toast from "../LoadingError/Toast";
import { toast } from "react-toastify";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 3000,
};

const OrderDetailmain = (props) => {
  const { orderId, config } = props;
  console.log(config);
  console.log(`https://localhost:7296/api/Admin/get-orderDetail/${orderId}`);
  const [order, setOrder] = useState([]);
  const handleGetOrderDetail = async () => {
    await axios.post(
    `https://localhost:7296/api/Admin/get-orderDetail/${orderId}`, {},
    config
  ).then(response => {
    console.log(response);
    setOrder(response.data.metadata);
  }).catch(error => {
    console.error(error)
  });
} 
  useEffect(() => {
    handleGetOrderDetail();
    // await checkCurrentOrderStatus();
  }, [])

  return (
    <>
      <Toast />
      <section className="content-main">
        <div className="content-header">
          <Link to="/orders" className="btn btn-dark text-white">
            Back To Orders
          </Link>
        </div>
          <div className="card">
            <header className="card-header p-3 Header-green">
              <div className="row align-items-center ">
                <div className="col-lg-6 col-md-6">
                  <span>
                    <i className="far fa-calendar-alt mx-2"></i>
                    <b className="text-white">
                      {moment(order[0].order.createdAt).format("llll")}
                    </b>
                  </span>
                  <br />
                  <small className="text-white mx-3 ">
                    Order ID: #{order[0].order.id}
                  </small>
                </div>
                <div className="col-lg-6 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                  <select
                    className="form-select d-inline-block"
                    style={{ maxWidth: "200px" }}
                  >
                    <option>Change status</option>
                    <option id="pending" value={0}>Pending</option>
                    <option id="confirmed" value={1}>Confirmed</option>
                    <option id="shipped" value={2}>Shipped</option>
                    <option id="cancelled" value={3}>Cancelled</option>
                    <option id="completed" value={4}>Completed</option>
                  </select>
                  <Link className="btn btn-success ms-2" to="#">
                    <i className="fas fa-print"></i>
                  </Link>
                </div>
              </div>
            </header>
            <div className="card-body">
              {/* Order info */}
              <OrderDetailInfo order={order} />

              <div className="row">
                <div className="col-lg-9">
                  <div className="table-responsive">
                    <OrderDetailProducts order={order} />
                  </div>
                </div>
                {/* Payment Info */}
                <div className="col-lg-3">
                  <div className="box shadow-sm bg-light">
                    {order.isDelivered ? (
                      <button className="btn btn-success col-12">
                        DELIVERED AT ({" "}
                        {moment(order.deliveredAt).format("MMM Do YY")})
                      </button>
                    ) : (
                      <>

                        <button
                        
                          className="btn btn-dark col-12"
                        >
                          MARK AS DELIVERED
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default OrderDetailmain;
