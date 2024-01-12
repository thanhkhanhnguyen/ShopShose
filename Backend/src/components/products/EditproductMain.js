import React, { useEffect, useRef, useState } from "react";
import { Img } from "react-image";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { lisCategories } from "../../redux/Actions/CategoryActions";
import { editProduct, updateProduct } from "../../redux/Actions/ProductActions";
import axios from "axios";
import {
  deleteUploadImage,
  uploadImage,
} from "../../redux/Actions/UploadActions";
import { PRODUCT_UPDATE_RESET } from "../../redux/Constants/ProductConstants";
import Message from "./../LoadingError/Error";
import Loading from "./../LoadingError/Loading";
import Toast from "./../LoadingError/Toast";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 3000,
};

const EditProductMain = (props) => {
  const { productId, config } = props;
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const inputRef = useRef(null);


  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successProduct,
  } = productUpdate;

  const categoryList = useSelector((state) => state.categoryList);
  const { loading: loadingList, error: errorList } = categoryList;

  const imageUpload = useSelector((state) => state.imageUpload);
  const { loading: loadingImage, error: errorImage, image } = imageUpload;

  const imageDelete = useSelector((state) => state.imageDelete);
  const { success: successDelete, error: errorDelete } = imageDelete;

  

  const handleGetProduct = async () => {
    try {
      const data = await axios.get(
        `https://localhost:7296/${productId}`,
        config
      );
      setProduct(data.data)
      setName(data.data.name);
      setPrice(data.data.price);
      setCountInStock(data.data.quantity);
      setDescription(data.data.description);
      setCategory(data.data.categoryId);
      setImages(data.data.image);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Error fetching data from the API");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProduct();
    
  }, [name]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (images) {
      dispatch(
        updateProduct({
          _id: productId,
          name,
          price,
          countInStock,
          description,
          category,
          images,
        })
      );
    } else if (image) {
      dispatch(
        updateProduct({
          _id: productId,
          name,
          price,
          countInStock,
          description,
          category,
          image,
        })
      );
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) {
        return alert("File not exist");
      }
      if (file.size > 1024 * 1024) {
        return alert("Size too large");
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return alert("File fotmat is incorrect");
      }
      let formData = new FormData();
      formData.append("file", file);
      dispatch(uploadImage(formData));
    } catch (error) {
      alert(error.message);
    }
  };


  console.log(images);
  const categories = [
    {
      id: 1,
      name: 'Thể Thao'
    },
    {
      id: 2,
      name: 'Thời Trang'
    },
    {
      id: 3,
      name: 'Chạy Bộ'
    },
    {
      id: 4,
      name: 'Sandal'
    },
    {
      id: 5,
      name: 'Dép'
    },
  ]
  const handleUpdateProduct = async () =>  {
    try {
      const response = await axios.put(
      `https://localhost:7296/api/Product/UpdateProduct/${productId}`,
      {
        id: parseInt(productId),
        name: name,
        description: description,
        price: parseInt(price),
        quantity: parseInt(countInStock),
        discount: 0,
        categoryId: parseInt(category),
        image: product.image,
        rating: 0,
      },
      config
    );
    console.log(response);
    alert(response.data);
    } catch (error) {
      console.error(error);
    }

  }
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Go to products
            </Link>
            <h2 className="content-title">Update Product</h2>
            <div>
              <button type="submit" className="btn btn-primary" onClick={handleUpdateProduct}>
                Publish now
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <>
                      <div className="mb-4">
                        <label htmlFor="product_title" className="form-label">
                          Product title
                        </label>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="form-control"
                          id="product_title"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="Type here"
                          className="form-control"
                          id="product_price"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Count In Stock
                        </label>
                        <input
                          type="number"
                          placeholder="Type here"
                          className="form-control"
                          id="product_price"
                          required
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Description</label>
                        <textarea
                          placeholder="Type here"
                          className="form-control"
                          rows="7"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Categories</label>
                       
                          <select
                            name="category"
                            className="form-select"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option value={category.id} key={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                      </div>
                    </>
                </div>
              </div>
            </div>
           
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProductMain;
