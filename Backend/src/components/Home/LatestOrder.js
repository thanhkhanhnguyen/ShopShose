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
    console.log(response.data.metadata);
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
            <tr>
            <th>Tên khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái thanh toán</th>
            <th>Phương thức thanh toán</th>
            <th>Ngày thanh toán</th>
            <th>Chi tiết</th>

            </tr>
              {orders.map((order) => (
                <tr key={order.order.id}>
                  <td>
                    <b>{order.user?.fullName}</b>
                  </td>
                  <td>${order.order.total}</td>
                  <td>
                      {order.payment?.paymentStatus == "00" ? (
                        <span className="badge rounded-pill alert-success">
                        {order.payment?.paymentLastMessage}
                      </span>) : (
                        <span className="badge rounded-pill alert-danger">
                        Chưa thanh toán
                      </span>
                      )}
                  </td>
                  <td>
                      {order.des?.id ? (
                        <span className="badge rounded-pill alert-success">
                        {order.des?.desShortName}
                      </span>) : (
                        <span className="badge rounded-pill alert-success">
                        Tiền mặt
                      </span>
                      )}
                  </td>
                  <td>{moment(order.order.createdAt).calendar()}</td>
                  <td className="d-flex justify-content-end align-item-center">
                    <Link to={`/order/${order.order.id}`} className="text-success">
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
