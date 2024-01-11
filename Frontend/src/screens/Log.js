import React, { useEffect } from "react";
import axios from "axios";

const Log = () => {
  const testLogin = async () => {
    const response1 = await axios.post(
      "https://localhost:7296/api/Auth/login",
      { email: "thanh123@gmail.com", password: "Thanh123@" },
      { withCredentials: true }
    );
    console.log(response1);
  };

  useEffect(() => {
    testLogin();
  }, []);
  return <div>Log</div>;
};

export default Log;
