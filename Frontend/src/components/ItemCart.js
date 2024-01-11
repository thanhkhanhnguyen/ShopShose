import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

const ItemCart = (props) => {
  const { index, item, setChangeItem, changeItem } = props;
  const [qt, setQt] = useState(item?.cart?.qty);

  const handleChangeQuantity = async (e) => {
    const value = e.target.value > 1 ? e.target.value : 1;
    setQt(value);
    const data = {
      id: item.product.id,
      quantity: value * 1,
    };
    await addToCart(data);
  };

  // add to cart
  const addToCart = async (item) => {
    // Gửi action addToCart với productId và quantity
    const userLogin = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: "Bearer " + String(userLogin.metadata.accessToken),
      },
    };
    try {
      const { id, quantity } = item;
      const data = {
        productId: id,
        quantity: quantity * 1,
      };

      const response = await axios.post(
        "https://localhost:7296/api/Cart/add",
        data,
        config
      );
      setChangeItem(!changeItem);
    } catch (error) {
      // Xử lý lỗi tại đây
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCartHandler = async (id) => {
    const userLogin = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: "Bearer " + String(userLogin.metadata.accessToken),
      },
    };

    const response = await axios.post(
      `https://localhost:7296/api/Cart/remove/${id}`,
      {},
      config
    );
    setChangeItem(!changeItem);
  };
  return (
    <div className="cart-iterm row" key={index}>
      <div
        onClick={() => removeFromCartHandler(item.product.id)}
        className="remove-button d-flex justify-content-center align-items-center"
      >
        <i className="fas fa-times"></i>
      </div>
      <div className="cart-image col-md-3">
        <img src={item.product.image} alt={item.name} />
      </div>
      <div className="cart-text col-md-5 d-flex align-items-center">
        <Link to={`/products/${item.product}`}>
          <h4>{item.product.name}</h4>
        </Link>
      </div>
      <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
        <h6>QUANTITY</h6>
        <input type="number" value={qt} onChange={handleChangeQuantity} />
      </div>
      <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
        <h6>PRICE</h6>
        <h4>${item.product.price}</h4>
      </div>
    </div>
  );
};

export default ItemCart;
