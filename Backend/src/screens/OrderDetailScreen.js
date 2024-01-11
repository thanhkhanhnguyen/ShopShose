import React from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import OrderDetailmain from "../components/orders/OrderDetailmain";

const OrderDetailScreen = ({ match }) => {
  const orderId = match.params.id;
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  console.log('Bearer ' + String(userLogin.accessToken));
  const config = {
    headers: {
      "Authorization": 'Bearer ' + String(userLogin.accessToken),
    },
  };
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <OrderDetailmain orderId={orderId} config={config}/>
      </main>
    </>
  );
};

export default OrderDetailScreen;
