import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { parseOrderStatus } from "../../services/order-status";
const Orders = (props) => {
  const { sortOrders } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Total</th>
          <th scope="col">Paid</th>
          <th scope="col">Date</th>
          <th>Status</th>
          <th scope="col" className="text-end">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {sortOrders?.length ? (
          sortOrders.map((order) => (
            <tr key={order.order.id}>
              <td>
                <b>{order.user.fullName}</b>
              </td>
              <td>{order.user.email}</td>
              <td>{order.order.total}</td>
              <td>
                {order.order.paymentId ? (
                  <span className="badge rounded-pill alert-success">
                    Paid At {moment(order.payment.paymentDate).format("MMM Do YY")}
                  </span>
                ) : (
                  <span className="badge rounded-pill alert-danger">
                    Not Paid
                  </span>
                )}
              </td>
              <td>{order?.order?.createdAt ? moment(order.order.createdAt).format("MMM Do YY") : moment().format("MMM Do YY")}</td>
              <td>
                  <span className="badge btn-success">{parseOrderStatus(order.order.status)}</span>
                  {/* <span className="badge btn-dark">Not Delivered</span> */}
              </td>
              <td className="d-flex justify-content-end align-item-center">
                <Link to={`/order/${order.order.id}`} className="text-success">
                  <i className="fas fa-eye"></i>
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <th colSpan={10}>
              <div className="d-flex justify-content-center col-12">
                <div className="alert alert-warning">No Orders</div>
              </div>
            </th>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Orders;
