import React from "react";
import { parsePaymentMethod } from "../../services/order-status";

const OrderDetailInfo = (props) => {
  const { order } = props;
  console.log(order);
  return (
    <div className="row mb-5 order-info-wrap">
      <div className="col-md-6 col-lg-4">
        <article className="icontext align-items-start">
          <span className="icon icon-sm rounded-circle alert-success">
            <i className="text-success fas fa-user"></i>
          </span>
          <div className="text">
            <h6 className="mb-1">Customer</h6>
            <p className="mb-1">
              {order[0].user.fullName} <br />
              <a href={`mailto:${order[0].user.email}`}>{order[0].user.email}</a>
            </p>
          </div>
        </article>
      </div>
      <div className="col-md-6 col-lg-4">
        <article className="icontext align-items-start">
          <span className="icon icon-sm rounded-circle alert-success">
            <i className="text-success fas fa-truck-moving"></i>
          </span>
          <div className="text">
            <h6 className="mb-1">Order info</h6>
            <p className="mb-1">
              Shipping: {order[0].order.address} <br /> Pay method:{" "}
              {parsePaymentMethod(order[0].order.paymentId)}
            </p>
          </div>
        </article>
      </div>
      <div className="col-md-6 col-lg-4">
        <article className="icontext align-items-start">
          <span className="icon icon-sm rounded-circle alert-success">
            <i className="text-success fas fa-map-marker-alt"></i>
          </span>
          <div className="text">
            <h6 className="mb-1">Deliver to</h6>
            <p className="mb-1">
              Address: {order[0].user.address}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default OrderDetailInfo;
