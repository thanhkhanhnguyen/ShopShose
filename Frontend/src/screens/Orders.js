import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([
    {
      paymentId: 1,
      address: "123 Main Street",
      status: "Pending",
      note: "Urgent delivery",
      paymentMethod: "Credit Card",
      phone: "123-456-7890",
      total: 100.0,
      paymentMessage: "Payment successful",
      paymentContent: "Order details",
      paymentDestination: "Home",
    },
    // Thêm các đơn hàng khác nếu cần
  ]);

  const [checkData, setCheckData] = useState(true);

  const userLogin = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: "Bearer " + String(userLogin.metadata.accessToken),
    },
  };
  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(
        "https://localhost:7296/api/Order/get",
        {},
        config
      );

      console.log(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <Header />
      <div className="order-container">
        <h2>Order Information</h2>
        {checkData ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Address</th>
                <th>Status</th>
                <th>Note</th>
                <th>Payment Method</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Payment Message</th>
                <th>Payment Content</th>
                <th>Payment Destination</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.paymentId} className="order-row">
                  <td>{order.paymentId}</td>
                  <td>{order.address}</td>
                  <td>{order.status}</td>
                  <td>{order.note}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.phone}</td>
                  <td>{order.total}</td>
                  <td>{order.paymentMessage}</td>
                  <td>{order.paymentContent}</td>
                  <td>{order.paymentDestination}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h3 style={{ marginTop: 150 }} className="text-center">
            No order
          </h3>
        )}
      </div>
    </>
  );
};

export default Order;
