import React from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import AddProductMain from "./../components/products/AddProductMain";

const AddProduct = () => {
  const userInfo = localStorage.getItem("userInfo");

  const config = {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  };
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <AddProductMain config={config} />
      </main>
    </>
  );
};

export default AddProduct;
