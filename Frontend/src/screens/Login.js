import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import Message from "./../components/LoadingError/Error";
import Loading from "./../components/LoadingError/Loading";
import { login } from "./../redux/Actions/UserActions";
import axios from "axios";

 const Login = ({ location, history }) => {
  window.scrollTo(0, 0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const testLogin=async()=>{
    const response1=await axios.post(
      "http://localhost:5134/api/Auth/login",
      {  email: "thanh123@gmail.com",
         password: "Thanh123@"}
    )
    console.log(response1)
  }
  
  
  useEffect(() => {
   
   testLogin();
  },[])

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  return (
    <>
      <Header />
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        {error && <Message variant="alert-danger">{error}</Message>}
        {loading && <Loading />}
        <form
          className="Login col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <p>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};
export default Login