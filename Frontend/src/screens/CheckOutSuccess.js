import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
// import "./CheckoutSuccess.css"; // Import file CSS của bạn để tùy chỉnh giao diện

const CheckOutSuccess = () => {
  return (
    <div className="checkout-success-container">
      <div className="checkout-success-content">
        <h2>Payment Successful</h2>
        <p>Thank you for your purchase!</p>
        <p>Your order has been successfully placed.</p>
        <p>An email confirmation has been sent to your email address.</p>
        <p>Order details:</p>
        {/* Hiển thị các chi tiết đơn hàng (nếu cần) */}
        {/* <div className="order-details">
          <p>Order ID: ABC123</p>
          <p>Total Amount: $100</p>

        </div> */}
        <p>For any inquiries, please contact our customer support.</p>
        <div className="mt-4">
          <Link className="continue-shopping-btn" to="/">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSuccess;
