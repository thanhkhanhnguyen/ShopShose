import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct } from "../../redux/Actions/ProductActions";
import { deleteUploadImage } from "../../redux/Actions/UploadActions";
import axios from "axios";

const Product = (props) => {
  const { product } = props;
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  console.log('Bearer ' + String(userLogin.accessToken));
  const config = {
    headers: {
      "Authorization": 'Bearer ' + String(userLogin.accessToken),
    },
  };
  const deleteHandler = async (id) => {
    try {
      if (window.confirm("Are you sure?")) {
      const response = await axios.post(`https://localhost:7296/delete/${id}`, {}, {
        headers: {
          "Content-Type": 'application/json',
          "Authorization": 'Bearer ' + String(userLogin.accessToken),
        },
      });
      alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
        <div className="card card-product-grid shadow-sm">
          <Link to="#" className="img-wrap">
            <img src={product.image} alt="Product" />
          </Link>
          <div className="info-wrap">
            <Link to="#" className="title text-truncate">
              {product.name}
            </Link>
            <div className="price mb-2">${product.price}</div>
            <div className="row">
              <Link
                to={`/product/${product.id}/edit`}
                className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
              >
                <i className="fas fa-pen"></i>
              </Link>
              <Link
                to="#"
                onClick={() => deleteHandler(product.id)}
                className="btn btn-sm btn-outline-danger p-2 pb-3 col-md-6"
              >
                <i className="fas fa-trash-alt"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
