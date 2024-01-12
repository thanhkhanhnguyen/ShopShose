import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Message from "./../LoadingError/Error";
import Loading from "./../LoadingError/Loading";
import OrderDetailInfo from "./OrderDetailInfo";
import OrderDetailProducts from "./OrderDetailProducts";
import moment from "moment";
import Toast from "../LoadingError/Toast";
import { toast } from "react-toastify";
import { parseOrderStatus } from "../../services/order-status";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 3000,
};

const OrderDetailmain = (props) => {
  const { orderId, config, userLogin } = props;
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleGetOrderDetail = async () => {
    try {
      const response = await axios.post(
        `https://localhost:7296/api/Admin/get-orderDetail/${orderId}`,
        {},
        config
      );
      setOrder(response.data.metadata);
      console.log(response.data.metadata);
      setLoading(false);
      handleOrderStatus(Number(response.data.metadata[0].order.status));
    } catch (error) {
      console.error(error);
      setError("Error fetching data from the API");
      setLoading(false);
    }
  };
  const handleOrderStatus = async (status) => {
    var pending = document.getElementById("pending");
    var confirmed = document.getElementById("confirmed");
    var shipped = document.getElementById("shipped");
    var cancelled = document.getElementById("cancelled");
    var completed = document.getElementById("completed");
    if (status == 0) {
      shipped.disabled = true;
      pending.disabled = true;
      completed.disabled = true;
    }
    else if (status == 1) {
      confirmed.disabled = true;
      pending.disabled = true;
      cancelled.disabled = true;
    }
    else if (status == 2) {
      shipped.disabled = true;
      pending.disabled = true;
      confirmed.disabled = true;
      cancelled.disabled = true;
    }
    else if (status == 3 || status == 4) {
      shipped.disabled = true;
      pending.disabled = true;
      confirmed.disabled = true;
      cancelled.disabled = true;
      completed.disabled = true;
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      // Gọi handleGetOrderDetail
      await handleGetOrderDetail();
    };
  
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }
  const handleChangeOrderStatus = async () => {
    try {
    const selectedStatus = document.getElementById("order-status").value;
    if (selectedStatus == 5) return;
    else {
      console.log(orderId);
      console.log(selectedStatus);
      console.log(config);
      console.log(userLogin);
      const response = await axios.post("https://localhost:7296/api/Admin/status", {
        orderId: parseInt(orderId),
        status: parseInt(selectedStatus)
      }, {
        headers: {
          "Content-Type": 'application/json',
          "Authorization": 'Bearer ' + String(userLogin.accessToken),
        },
      });
      alert(response.data.message);
    }
  } catch (error) {
    console.error(error);
  }
  }
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
                  <span className="badge rounded-pill alert alert-success text-success">
                      {parseOrderStatus(order[0].order.status)}
                    </span>
                </div>
                <div className="col-lg-6 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                  <select
                    className="form-select d-inline-block"
                    id="order-status"
                    style={{ maxWidth: "200px" }}
                  >
                    <option value={5}>Change status</option>
                    <option id="pending" value={0}>Pending</option>
                    <option id="confirmed" value={1}>Confirmed</option>
                    <option id="shipped" value={2}>Shipped</option>
                    <option id="cancelled" value={3}>Cancelled</option>
                    <option id="completed" value={4}>Completed</option>
                  </select>
                  <button className="btn btn-success ms-2" onClick={handleChangeOrderStatus}>
                    <i className="fas fa-print"></i>
                  </button>
                </div>
              </div>
            </header>
            <div className="card-body">
              {/* Order info */}
              <OrderDetailInfo order={order} />

              <div className="row">
                <div className="col-lg-9">
                  <div className="table-responsive">
                    <OrderDetailProducts order={order}/>
                  </div>
                </div>
                {/* Payment Info */}
                <div className="col-lg-3">
                  <div className="box shadow-sm bg-light">
                    {order[0].order.paymentId ? (
                      <button className="btn btn-success col-12">
                        DELIVERED AT ({" "}
                        {moment(order.deliveredAt).format("MMM Do YY")})
                      </button>
                    ) : (
                      <>

                        <button disabled
                        
                          className="btn btn-dark col-12"
                        >
                          HAVE NOT BEEN DELIVERED YET
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
