import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

const Order = () => {
  const history = useHistory();
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

  const [dataOrdersDB, setDataOrdersDB] = useState([]);

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

      console.log(response.data.metadata);
      const sortData = response.data.metadata.sort(
        (a, b) => b.order.id - a.order.id
      );
      setDataOrdersDB(sortData || []);
    };
    getData();
  }, []);

  // Pagination
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const dataOrders = dataOrdersDB?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataOrdersDB.length / itemsPerPage);

  // console.log(dataOrders.length);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBackPage = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pending,
  // Confirmed,
  // Shipped,
  // Cancelled,
  // Completed
  const getStatus = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Confirmed";
      case 2:
        return "Shipped";
      case 3:
        return "Cancelled";
      case 4:
        return "Completed";
      default:
        return "Pending";
    }
  };

  const handleDetailOrder = (id) => {
    // console.log("order", id);
    history.push(`/detail-order/${id}`);
  };

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
              {dataOrders.map((item) => (
                <tr
                  onClick={() => handleDetailOrder(item.order.id)}
                  key={item.order.id}
                  className="order-row"
                >
                  <td>{item.order.id}</td>
                  <td>{item.order.address}</td>
                  <td>{getStatus(item.order.status)}</td>
                  <td>{item.order.note}</td>
                  <td>{item.order.payMethod}</td>
                  <td>{item.order.phone}</td>
                  <td>{item.order.total}</td>
                  <td>{item.paymentMessage}</td>
                  <td>{item.paymentContent}</td>
                  <td>{item.paymentDes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h3 style={{ marginTop: 150 }} className="text-center">
            No order
          </h3>
        )}

        <div className="d-flex justify-content-center align-items-center mt-4">
          {totalPages ? (
            <>
              <button
                onClick={handleBackPage}
                style={{ backgroundColor: "white" }}
                className="border-0"
              >
                {"<"}
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  onClick={() => handlePageChange(index + 1)}
                  key={index}
                  style={{
                    backgroundColor: "white",
                    color: index + 1 === currentPage ? "blueviolet" : "gray",
                    textDecoration:
                      index + 1 === currentPage ? "underline" : "none",
                  }}
                  className="border-0"
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                style={{ backgroundColor: "white" }}
                className="border-0"
              >
                {">"}
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
