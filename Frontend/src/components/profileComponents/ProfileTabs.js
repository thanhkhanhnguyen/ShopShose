import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../redux/Actions/UserActions";
import Message from "./../LoadingError/Error";
import Loading from "./../LoadingError/Loading";
import Toast from "./../LoadingError/Toast";
import axios from "axios";

const ProfileTabs = (props) => {
  const { info } = props;
  console.log(info.email);
  const [name, setName] = useState(info.fullName || "");
  // const [email, setEmail] = useState(info.email || "");
  const [address, setAddress] = useState(info.address || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toastId = React.useRef(null);

  const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 3000,
  };

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: updateLoading } = userUpdateProfile;

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(
        "https://localhost:7296/api/User/profile",
        {},
        config
      );

      // console.log(response.data);
      // setDataUser(response.data);
      if (response) {
        setName(response.data.fullName);
        setAddress(response.data.address);
      }
    };
    getData();
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     setName(user.name);
  //     setAddress(user.address);
  //   }
  // }, [dispatch, user]);

  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: {
      Authorization: "Bearer " + String(userLogin.metadata.accessToken),
    },
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // password match
    if (password !== confirmPassword) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Passwords does not match", ToastObjects);
      }
    } else {
      const response = await axios.put(
        "https://localhost:7296/api/User/edit-profile",
        {
          fullName: name,
          address: address,
        },
        config
      );
      console.log(response);
      if (response.status === 200) {
        toastId.current = toast.success("Profile Updated", ToastObjects);
      } else {
        toastId.current = toast.error("Updated Failed", ToastObjects);
      }
    }
  };
  return (
    <>
      <Toast />
      {error && <Message variant="alert-danger">{error}</Message>}
      {loading && <Loading />}
      {updateLoading && <Loading />}
      <form className="row  form-container" onSubmit={submitHandler}>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">UserName</label>
            <input
              className="form-control"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">Phone Number</label>
            <input
              className="form-control"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* <div className="col-md-6">
          <div className="form">
            <label for="account-pass">New Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-confirm-pass">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div> */}
        <button type="submit">Update Profile</button>
      </form>
    </>
  );
};

export default ProfileTabs;
