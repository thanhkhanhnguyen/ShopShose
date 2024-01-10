import React, { useEffect } from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import OrderMain from "../components/orders/OrderMain";
import { useDispatch } from "react-redux";
import { listOrders } from "../redux/Actions/OrderActions";

const OrderScreen = () => {
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  console.log('Bearer ' + String(userLogin.accessToken));
  const config = {
    headers: {
      "Authorization": 'Bearer ' + String(userLogin.accessToken),
    },
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <OrderMain config={config} />
      </main>
    </>
  );
};

export default OrderScreen;
