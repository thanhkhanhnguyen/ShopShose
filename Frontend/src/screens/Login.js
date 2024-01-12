import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import Message from "./../components/LoadingError/Error";
import Loading from "./../components/LoadingError/Loading";
import { login } from "./../redux/Actions/UserActions";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = ({ location, history }) => {
  window.scrollTo(0, 0);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(12, "Must be 12 character or less")
        .required("Required"),
    }),

    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      // SignIn(formik, values, toast);
      submitHandler(values);
    },
  });

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (values) => {
    // e.preventDefault();
    const email = values.email;
    const password = values.password;
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
          // onSubmit={submitHandler}
          onSubmit={formik.handleSubmit}
        >
          <input
            id="email"
            type="email"
            placeholder="Email"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            {...formik.getFieldProps("email")}
          />
          <div style={{ marginTop: -28 }} className="d-flex p-0">
            {formik.touched.email && formik.errors.email ? (
              <p className="text-error text-danger ms-auto fs-6">
                {formik.errors.email}*
              </p>
            ) : null}
          </div>
          <input
            id="password"
            type="password"
            placeholder="Password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}

            {...formik.getFieldProps("password")}
          />
          <div style={{ marginTop: -28 }} className="d-flex p-0">
            {formik.touched.password && formik.errors.password ? (
              <p className="text-error text-danger fs-6 ms-auto">
                {formik.errors.password}*
              </p>
            ) : null}
          </div>
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
export default Login;
