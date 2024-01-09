import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Toast from "../components/LoadingError/Toast";
import { login } from "../redux/Actions/UserActions";
import Message from "./../components/LoadingError/Error";
import Loading from "./../components/LoadingError/Loading";

const Login = () => {
  window.scroll(0, 0);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginResult, setLoginResult] = useState(false);
  const history = useHistory();
  const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {
    if (userInfo) {
      window.location.href = '/';
    }
  }, [loginResult]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoginResult(await login(email, password));
    history.push("/");
  };
  return (
    <>
      <Toast />
      <div
        className="card shadow mx-auto"
        style={{ maxWidth: "380px", marginTop: "100px" }}
      >
        <div className="card-body">
          <h4 className="card-title mb-4 text-center">Sign in</h4>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
