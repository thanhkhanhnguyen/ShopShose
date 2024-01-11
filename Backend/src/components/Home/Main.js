import React from "react";
import TopTotal from "./TopTotal";
import LatestOrder from "./LatestOrder";
import SaleStatistics from "./SalesStatistics";
import ProductsStatistics from "./ProductsStatistics";
import { useSelector } from "react-redux";

const Main = () => {
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  console.log('Bearer ' + String(userLogin.accessToken));
  const config = {
    headers: {
      "Authorization": 'Bearer ' + String(userLogin.accessToken),
    },
  };
  return (
    <>
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title"> Dashboard </h2>
        </div>
        {/* Top Total */}
        <TopTotal config={config} />

        <div className="row">
          {/* STATICS */}
          <SaleStatistics />
          <ProductsStatistics />
        </div>

        {/* LATEST ORDER */}
        <div className="card mb-4 shadow-sm">
          <LatestOrder config={config} />
        </div>
      </section>
    </>
  );
};

export default Main;
