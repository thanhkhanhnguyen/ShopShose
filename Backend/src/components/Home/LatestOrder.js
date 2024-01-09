import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const LatestOrder = (props) => {
  const { config } = props;
  const [orders, setOrders] = useState([]);

  const handleGetNewOrders = async () => {
    await axios.get(
    "https://localhost:7296/api/Admin/new-orders",
    config
  ).then(response => {
    setOrders(response.data.metadata);
  }).catch(error => {
    console.error(error)
  });
} 
  useEffect(() => {
    handleGetNewOrders();
  }, [])
  return (
    <div className="card-body">
      <h5 className="card-title">New orders</h5>
        <div className="table-responsive">
          <table className="table">
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <b>{order.user?.name}</b>
                  </td>
                  <td>{order.user?.email}</td>
                  <td>${order.total}</td>
                  <td>
                    {order.isPaid ? (
                      <span className="badge rounded-pill alert-success">
                        Paid At {moment(order.paidAt).format("MMM Do YY")}
                      </span>
                    ) : (
                      <span className="badge rounded-pill alert-danger">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td>{moment(order.createdAt).calendar()}</td>
                  <td className="d-flex justify-content-end align-item-center">
                    <Link to={`/order/${order.id}`} className="text-success">
                      <i className="fas fa-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default LatestOrder;
