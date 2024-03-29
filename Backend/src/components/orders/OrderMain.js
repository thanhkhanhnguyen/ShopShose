import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Orders from "./Orders";
import { parseOrderStatus } from "../../services/order-status";

const OrderMain = (props) => {
  const { config } = props;
  const [orders, setOrders] = useState([]);
  const handleGetNewOrders = async () => {
    await axios.get(
    "https://localhost:7296/api/Admin/orders",
    config
  ).then(response => {
    console.log(response);
    setOrders(response.data.metadata);
  }).catch(error => {
    console.error(error)
  });
} 
  useEffect(() => {
    handleGetNewOrders();
  }, [])
  const [searchOrder, setSearchOrder] = useState("");
  const [statusList] = useState([
    0,
    1,
    2,
    3,
    4,
  ]);
  const [selectedStatus, setSelectedStatus] = useState();
  const [sortList] = useState([
    "Total: low -> high",
    "Total: high -> low",
    "Date: newest",
    "Date: oldest",
  ]);
  const [selectedSort, setSelectedSort] = useState();

  // Search product
  const searchOrders = orders?.filter((order) => {
    console.log(order);
    if (searchOrder === "") {
      return order;
    } else if (
      order.user.fullName.toLowerCase().includes(searchOrder.toLowerCase())
    ) {
      return order;
    }
  });

  // filter by Status
  const handleOrderStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const getFilterStatus = () => {
    console.log(searchOrders);
    if (!selectedStatus) {
      return searchOrders;
    } else {
      return searchOrders?.filter((order) => order.order.status == selectedStatus);
    }
  };

  const filterStatus = useMemo(getFilterStatus, [selectedStatus, searchOrders]);

  console.log(filterStatus);

  // Sort
  const handleOrderSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const getSortOrder = () => {
    if (!selectedSort) {
      return filterStatus;
    } else if (selectedSort === "Total: low -> high") {
      return filterStatus?.sort(
        (a, b) => parseFloat(a.totalPrice) - parseFloat(b.totalPrice)
      );
    } else if (selectedSort === "Total: high -> low") {
      return filterStatus?.sort(
        (a, b) => parseFloat(b.totalPrice) - parseFloat(a.totalPrice)
      );
    } else if (selectedSort === "Date: newest") {
      return filterStatus?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (selectedSort === "Date: oldest") {
      return filterStatus?.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
  };

  const sortOrders = useMemo(getSortOrder, [selectedSort, filterStatus]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Orders</h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white">
          <div className="row gx-3 py-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                onChange={(e) => setSearchOrder(e.target.value)}
              />
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select
                name="orderStatus"
                className="form-select"
                onChange={handleOrderStatusChange}
              >
                <option value="">Select a status</option>
                {statusList.map((status) => (
                  <option value={status} key={status}>
                    {parseOrderStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>
        <div className="card-body">
          <div className="table-responsive">
              <Orders sortOrders={sortOrders} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderMain;
