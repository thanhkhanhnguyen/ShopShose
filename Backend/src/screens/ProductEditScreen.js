import React from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import EditProductMain from "./../components/products/EditproductMain";

const ProductEditScreen = ({ match }) => {
  const productId = match.params.id;
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
        <EditProductMain productId={productId} config={config} />
      </main>
    </>
  );
};
export default ProductEditScreen;
