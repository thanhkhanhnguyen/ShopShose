import React, { useState } from "react";
import axios from "axios";

const TopTotal = (props) => {
  const { orders, products } = props;
  if (orders) {
    orders.map((order) =>
      order.isPaid === true ? (totalSale = totalSale + order.totalPrice) : null
    );
  }
  const [totalSale, setTotalSale] = useState("");
  const [totalProduct, setTotalProduct] = useState("");
  const [totalOrder, setTotalOrder] = useState("");
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  console.log('Bearer ' + String(userLogin.metadata.accessToken));
  const config = {
    headers: {
      "Authorization": 'Bearer ' + String(userLogin.metadata.accessToken),
    },
  };
  axios.get(
    "https://localhost:7296/api/Admin/total-sale",
    config
  ).then(response => {
    setTotalSale(response.data.metadata);
  }).catch(error => {
    console.error(error)
  });
  axios.get(
    "https://localhost:7296/api/Admin/total-product",
    config
  ).then(response => {
    setTotalProduct(response.data.metadata);
  }).catch(error => {
    console.error(error)
  });
  axios.get(
    "https://localhost:7296/api/Admin/total-order",
    config
  ).then(response => {
    setTotalOrder(response.data.metadata);
  }).catch(error => {
    console.error(error)
  });
  return (
    <div className="row">
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-primary">
              <i className="text-primary fas fa-usd-circle"></i>
            </span>
            <div className="text">
              <h6 className="mb-1">Total Sales</h6>{" "}
              <span>{ totalSale }</span>
            </div>
          </article>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-success">
              <i className="text-success fas fa-bags-shopping"></i>
            </span>
            <div className="text">
              <h6 className="mb-1">Total Orders</h6>
              <span>{totalOrder || 0}</span>
            </div>
          </article>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-warning">
              <i className="text-warning fas fa-shopping-basket"></i>
            </span>
            <div className="text">
              <h6 className="mb-1">Total Products</h6>
              {totalProduct ? <span>{totalProduct}</span> : <span>0</span>}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default TopTotal;
