import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import ItemOrder from "../components/ItemOrder";
const DetailOrder = () => {
  const { id } = useParams();

  const [data, setData] = useState([]);

  const userLogin = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: "Bearer " + String(userLogin.metadata.accessToken),
    },
  };
  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(
        `https://localhost:7296/api/Order/get-orderDetail/${id}`,
        {},
        config
      );

      console.log(response.data.metadata);
      setData(response.data.metadata || []);
      // Tính tổng quantity
    };
    getData();
  }, []);

  const totalQuantity = data.reduce((acc, item) => {
    return acc + item.orderDetail.quantity;
  }, 0);

  return (
    <>
      <Header />
      <div className="container">
        <div className=" mt-3 d-flex gap-4 ">
          <h4>Quantity: {totalQuantity}</h4>
          <h4>Total: ${data[0]?.order?.total}</h4>
        </div>
        {data?.map((item, index) => (
          <ItemOrder item={item} index={index} />
        ))}
      </div>
    </>
  );
};

export default DetailOrder;
