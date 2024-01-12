import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

const ItemOrder = (props) => {
  const { index, item } = props;
  return (
    <div className="cart-iterm row" key={index}>
      {/* <div
        //   onClick={() => removeFromCartHandler(item.product.id)}
        className="remove-button d-flex justify-content-center align-items-center"
      >
        <i className="fas fa-times"></i>
      </div> */}
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
        <input disabled type="number" value={item?.orderDetail?.quantity} />
      </div>
      <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
        <h6>PRICE</h6>
        <h4>${item.product.price}</h4>
      </div>
    </div>
  );
};

export default ItemOrder;
