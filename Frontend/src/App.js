import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import PrivateRouter from "./PrivateRouter";
import "./responsive.css";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import OrderScreen from "./screens/OrderScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Register from "./screens/Register";
import ShippingScreen from "./screens/ShippingScreen";
import SingleProduct from "./screens/SingleProduct";
import Log from "./screens/Log";
import CheckOutSuccess from "./screens/CheckOutSuccess";
import WaitOrder from "./screens/WaitOrder";
import Order from "./screens/Orders";
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomeScreen} exact />
        <Route path="/log" component={Log} />
        <Route path="/products/:id" component={SingleProduct} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRouter path="/profile" component={ProfileScreen} />
        <Route path="/cart/:id?" component={CartScreen} />
        <PrivateRouter path="/shipping" component={ShippingScreen} />
        <PrivateRouter path="/payment" component={PaymentScreen} />
        <PrivateRouter path="/placeorder" component={PlaceOrderScreen} />
        <PrivateRouter path="/order/:id" component={OrderScreen} />
        <Route path="/orders" component={Order} />
        <Route path="/check-out-success" component={CheckOutSuccess} />
        <Route path="/wait-order" component={WaitOrder} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
