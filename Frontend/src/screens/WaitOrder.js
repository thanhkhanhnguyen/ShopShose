import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const WaitOrder = () => {
  const location = useLocation();
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: "Bearer " + String(userLogin.metadata.accessToken),
    },
  };

  const currentURL = window.location.href || "";
  const query = currentURL.split("?")[1];
  // console.log(`https://localhost:7296/api/payment/vnpay-return?${query}`);

  // const { partnerCode, resultCode } = useParams();
  // Lấy giá trị của partnerCode từ query parameters
  const queryParams = new URLSearchParams(location.search);
  const partnerCode = queryParams.get("partnerCode");
  const vnp_ResponseCode = queryParams.get("vnp_ResponseCode"); //00->ok
  const resultCode = queryParams.get("resultCode"); //0->ok

  // console.log(partnerCode);
  useEffect(() => {
    const order = async () => {
      const response = await axios.get(
        partnerCode === "MOMO"
          ? `https://localhost:7296/api/payment/momo-return?${query}`
          : `https://localhost:7296/api/payment/vnpay-return?${query}`,
        config
      );

      if (response) {
        window.location.href = "/check-out-success";
      }
    };
    order();
  }, []);

  const check = () => {
    if (partnerCode === "MOMO") {
      if (resultCode !== "0") return false;
      return true;
    } else {
      if (vnp_ResponseCode !== "00") return false;
      return true;
    }
  };

  return (
    <div className="page-wait-order">
      {/* <h2 className="">Waiting Order...</h2> */}
      {check() ? (
        <h2 className="text-success ">Order Is Success</h2>
      ) : (
        <h2 className="text-danger">Order Is Failed </h2>
      )}
    </div>
  );
};

export default WaitOrder;
