import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../redux/Actions/UserActions";
import Header from "./../components/Header";
import Message from "./../components/LoadingError/Error";
import Loading from "./../components/LoadingError/Loading";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Toast from "./../components/LoadingError/Toast";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const Register = ({ location, history }) => {
  window.scrollTo(0, 0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split("="[1]) : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = async (values) => {
    // e.preventDefault();
    // dispatch(register(name, email, password, phone));
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response =
      (await axios.post(
        `https://localhost:7296/api/Auth/register`,
        {
          fullName: values.username,
          email: values.email,
          password: values.password,
          phone: values.phone,
          address: "string",
        },
        config
      )) || false;
    // console.log(response.data);
    if (response.data.status === 201) {
      // toast.error("Register is failed", ToastObjects);
      toast.success("Register is successfully", ToastObjects);
      setTimeout(() => {
        history.push("/login"); // Thay '/your-redirect-path' bằng đường dẫn bạn muốn chuyển hướng đến
      }, 2000);
    }
    if (!response) {
      toast.error("Register is failed", ToastObjects);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      phone: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().max(50, "Must be 50 characters or less"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(20, "Must be 20 character or less")
        .required("Required"),
      phone: Yup.string()
        .matches(/^[0-9]/, "Must be contain only numbers")
        .test(
          "startsWithZero",
          "Phone number must start with 0",
          function (value) {
            return value && value.charAt(0) === "0";
          }
        ),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      // navigateLogin(checkRegister(formik, values, toast));
      submitHandler(values);
    },
  });
  return (
    <>
      <Header />
      <Toast />
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        {error && <Message variant="alert-danger">{error}</Message>}
        {loading && <Loading />}
        <form
          className="Login col-md-8 col-lg-4 col-11"
          // onSubmit={submitHandler}
          onSubmit={formik.handleSubmit}
        >
          <input
            type="text"
            placeholder="Username"
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            {...formik.getFieldProps("username")}
          />
          <div style={{ marginTop: -28 }} className="d-flex p-0">
            {formik.touched.username && formik.errors.username ? (
              <p className="text-error text-danger ms-auto fs-6">
                {formik.errors.username}*
              </p>
            ) : null}
          </div>
          <input
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
            type="password"
            placeholder="Password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
            {...formik.getFieldProps("password")}
          />
          <div style={{ marginTop: -28 }} className="d-flex p-0">
            {formik.touched.password && formik.errors.password ? (
              <p className="text-error text-danger ms-auto fs-6">
                {formik.errors.password}*
              </p>
            ) : null}
          </div>
          <input
            type="text"
            placeholder="Phone Number"
            // value={phone}
            // onChange={(e) => setPhone(e.target.value)}
            {...formik.getFieldProps("phone")}
          />
          <div style={{ marginTop: -28 }} className="d-flex p-0">
            {formik.touched.phone && formik.errors.phone ? (
              <p className="text-error text-danger ms-auto fs-6">
                {formik.errors.phone}*
              </p>
            ) : null}
          </div>

          <button type="submit">Register</button>
          <p>
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              I Have Account <strong>Login</strong>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
