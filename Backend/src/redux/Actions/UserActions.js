import axios from "axios";
import {
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
} from "../Constants/UserConstants";
import { toast } from "react-toastify";

// Login
export const login = async (email, password) => {
  try {

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "https://localhost:7296/api/Auth/login",
      { email, password },
      config
    );
    
    if (!data.metadata.role.includes("Admin")) {
      return alert("You are not Admin");
    }
    localStorage.setItem("userInfo", JSON.stringify(data.metadata));
    
    return true;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      logout();
    }
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("userInfo");
  document.location.href = "/login";
};

// All user
export const listUser = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`https://localhost:7296/api/Admin/users`, config);

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
