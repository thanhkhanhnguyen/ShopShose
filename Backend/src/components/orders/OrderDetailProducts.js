import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { parseOrderStatus } from "../../services/order-status";

const OrderDetailProducts = (props) => {
  const { order } = props;
  const [total, setTotal] = useState(0);
  useEffect(() => {
    order.map((e) => {
        setTotal(total + e.product.price * e.orderDetail.quantity);
      })
  }, [])
  
  return (
    <table className="table border table-lg">
      <thead>
        <tr>
          <th style={{ width: "40%" }}>Product</th>
          <th style={{ width: "20%" }}>Unit Price</th>
          <th style={{ width: "20%" }}>Quantity</th>
          <th style={{ width: "20%" }} className="text-end">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {order.length && order.map((item, index) => (
          <tr key={index}>
            <td>
              <Link className="itemside" to="#">
                <div className="left">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: "40px", height: "40px" }}
                    className="img-xs"
                  />
                </div>
                <div className="info">{item.product.name}</div>
              </Link>
            </td>
            <td>${item.product.price}</td>
            <td>{item.orderDetail.quantity}</td>
            <td className="text-end"> ${item.product.price * item.orderDetail.quantity}</td>
          </tr>
        ))}

        {
          order.length && (<tr>
          <td colSpan="4">
            <article className="float-end">
              <dl className="dlist">
                <dt>Subtotal:</dt> <dd>${total}</dd>
              </dl>
              <dl className="dlist">
                <dt>Shipping cost:</dt> <dd>${total * 0.05}</dd>
              </dl>
              <dl className="dlist">
                <dt>Grand total:</dt>
                <dd>
                  <b className="h5">${total * 1.05}</b>
                </dd>
              </dl>
              
            </article>
          </td>
        </tr>)
        }
      </tbody>
    </table>
  );
};

export default OrderDetailProducts;
