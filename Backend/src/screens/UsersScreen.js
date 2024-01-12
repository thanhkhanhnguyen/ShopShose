import React from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import UserComponent from "../components/users/UserComponent";

const UsersScreen = () => {
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
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
        <UserComponent config={config} />
      </main>
    </>
  );
};

export default UsersScreen;
