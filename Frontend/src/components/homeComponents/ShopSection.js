import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { lisCategories } from "../../redux/Actions/CategoryActions";
import { listProduct } from "../../redux/Actions/ProductActions";
import { ORDER_DETAILS_RESET } from "../../redux/Constants/OrderConstants";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Pagination from "./pagination";
import Rating from "./Rating";
import "./ShopSection.css";
import { ProductDataService } from "./../../redux/Actions/ProductActions";
import axios from "axios";

const ShopSection = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const categoryList = useSelector((state) => state.categoryList);
  const { loading: loadingList, error: errorList, categories } = categoryList;

  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [sortName] = useState([
    // "Latest added",
    // "Oldest added",
    "Alphabet: A->Z",
    "Alphabet: Z->A",
    "Price: low -> high",
    "Price: hight -> low",
  ]);
  const [selectedSort, setSelectedSort] = useState();
  // const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [listOfProducts, setProducts] = useState();

  // const getProductList = () => {
  //   ProductDataService?.listProduct
  //     .then((res) => {
  //       setProducts(res.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  const [totalPage, setTotalPage] = useState(null);

  // console.log(Math.ceil(listOfProducts.length / 8));

  useEffect(() => {
    const fetchData = async () => {
      const rs = await axios.get("http://localhost:5134/api/Product");
      setProducts(rs?.data);
      // console.log(rs);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchProduct !== "") {
        setCurrentPage(1);
        const rs = await axios.get(
          `http://localhost:5134/search?searchString=${searchProduct}`
        );
        setProducts(rs?.data);
      } else {
        setCurrentPage(1);
        const rs = await axios.get("http://localhost:5134/api/Product");
        setProducts(rs?.data);
      }
      // console.log(rs);
    };

    fetchSearch();
  }, [searchProduct]);

  useEffect(() => {
    setTotalPage(Math.ceil(listOfProducts?.length / 8));
  }, [listOfProducts]);

  // useEffect(() => {
  //   getProductList();
  //   dispatch(lisCategories());
  //   dispatch({ type: ORDER_DETAILS_RESET });
  // }, [dispatch]);
  // Search product
  const searchProducts = products?.filter((product) => {
    setCurrentPage(1);
    if (searchProduct === "") {
      return product;
    } else if (
      product.name.toLowerCase().includes(searchProduct.toLowerCase())
    ) {
      return product;
    }
  });

  // // console.log(paginateHome(8, currentPage, listOfProducts));
  // useEffect(() => {
  //   if (listOfProducts.length > 0) {
  //     setProducts(paginateHome(8, currentPage, listOfProducts));
  //   }
  // }, [currentPage]);

  // const listProductDisplayed = paginateHome(8, 1, listOfProducts);
  // Filter by category
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const getFilterList = () => {
    if (!selectedCategory) {
      return searchProducts;
    }
    return searchProducts.filter(
      (product) => product.category === selectedCategory
    );
  };

  const filterList = useMemo(getFilterList, [selectedCategory, searchProducts]);

  // Sort
  const handleSortChange = (e) => {
    console.log(e.target.value);
    // setSelectedSort(e.target.value);
    const value = e.target.value;

    switch (value) {
      case "Alphabet: A->Z":
        const cloneDT = [...listOfProducts];
        cloneDT.sort(function (a, b) {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          const isAAlphabetical = /^[a-z]/.test(nameA);
          const isBAlphabetical = /^[a-z]/.test(nameB);

          if (isAAlphabetical && !isBAlphabetical) {
            return -1; // a should be sorted before b
          } else if (!isAAlphabetical && isBAlphabetical) {
            return 1; // b should be sorted before a
          } else {
            return nameA.localeCompare(nameB, undefined, {
              sensitivity: "base",
            });
          }
        });
        setProducts(cloneDT);
        break;
      case "Alphabet: Z->A":
        // code to be executed if expression === value2
        const cloneDT2 = [...listOfProducts];
        cloneDT2.sort(function (a, b) {
          if (a.name < b.name) {
            return 1; // b should be sorted before a
          }
          if (a.name > b.name) {
            return -1; // a should be sorted before b
          }
          return 0; // names are equal
        });
        setProducts(cloneDT2);
        break;
      case "Price: low -> high":
        // code to be executed if expression === value2
        const cloneDT3 = [...listOfProducts];
        cloneDT3.sort(function (a, b) {
          if (a.price < b.price) {
            return -1; // b should be sorted before a
          }
          if (a.price > b.price) {
            return 1; // a should be sorted before b
          }
          return 0; // names are equal
        });
        setProducts(cloneDT3);
        break;
      case "Price: hight -> low":
        const cloneDT4 = [...listOfProducts];
        cloneDT4.sort(function (a, b) {
          if (a.price < b.price) {
            return 1; // b should be sorted before a
          }
          if (a.price > b.price) {
            return -1; // a should be sorted before b
          }
          return 0; // names are equal
        });
        setProducts(cloneDT4);
        break;
      // additional cases as needed
      default:
      // code to be executed if none of the cases match
    }
  };

  const getSortList = () => {
    if (!selectedSort) {
      return filterList;
    } else if (selectedSort === "Latest added") {
      return filterList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (selectedSort === "Oldest added") {
      return filterList.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (selectedSort === "Price: low -> high") {
      return filterList?.sort((a, b) => (a.price > b.price ? 1 : -1));
    } else if (selectedSort === "Price: hight -> low") {
      return filterList?.sort((a, b) => (a.price > b.price ? -1 : 1));
    }
  };

  const sortList = useMemo(getSortList, [selectedSort, filterList]);

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listOfProducts?.slice(indexOfFirstItem, indexOfLastItem);

  // const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage + 1 <= totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBackPage = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4 shadow-sm mx-3">
                <header className="card-header gradient">
                  <div className="row gx-3 py-3">
                    <div className="col-lg-4 col-md-6 me-auto py-1">
                      <input
                        type="search"
                        placeholder="Search..."
                        className="form-control"
                        onChange={(e) => setSearchProduct(e.target.value)}
                      />
                    </div>
                    {/* <div className="col-lg-3 col-md-3 py-1">
                      {loadingList ? (
                        <Loading />
                      ) : errorList ? (
                        <Message variant="alert-danger">{errorList}</Message>
                      ) : (
                        <select
                          name="category"
                          className="form-select"
                          onChange={handleCategoryChange}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option value={category._id} key={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div> */}
                    <div className="col-lg-2 col-md-3 py-1">
                      <select
                        name="sort"
                        className="form-select"
                        onChange={handleSortChange}
                      >
                        <option value="">Select a sort</option>
                        {sortName.map((name) => (
                          <option value={name} key={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </header>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 article">
              <div className="shopcontainer row">
                {loading ? (
                  <div className="mb-5">
                    <Loading />
                  </div>
                ) : error ? (
                  <Message variant="alert-danger">{error}</Message>
                ) : (
                  <>
                    {currentItems?.map((product, index) => {
                      // Thêm điều kiện kiểm tra, ví dụ chỉ hiển thị sản phẩm có giá dưới $50
                      if (typeof product !== undefined) {
                        return (
                          <div
                            className="shop col-lg-4 col-md-6 col-sm-6"
                            key={index}
                          >
                            {/* Các phần tử HTML khác */}
                            <div className="border-product shadow-sm">
                              <Link to={`/products/${product?.id}`}>
                                <div
                                  className="shopBack"
                                  style={{
                                    width: "100%",
                                  }}
                                >
                                  <img
                                    src={product?.image}
                                    alt={product.name}
                                  />
                                </div>
                              </Link>

                              <div className="shoptext">
                                <p>
                                  <Link to={`/products/${product._id}`}>
                                    {product.name}
                                  </Link>
                                </p>

                                <Rating
                                  value={product.rating}
                                  text={`${product.numReviews} reviews`}
                                />
                                <h3>${product.price}</h3>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Trường hợp không thỏa mãn điều kiện, trả về null hoặc một giá trị tùy ý
                      return <></>;
                    })}
                  </>
                )}
                {/* Pagination */}
                {/* <Pagination
                  productsPerPage={productsPerPage}
                  totalProducts={sortList ? sortList.length : 0}
                  currentPage={currentPage}
                  paginate={paginate}
                /> */}

                <div className="d-flex justify-content-center align-items-center">
                  {totalPage ? (
                    <>
                      <button
                        onClick={handleBackPage}
                        style={{ backgroundColor: "white" }}
                        className="border-0"
                      >
                        {"<"}
                      </button>

                      {[...Array(totalPage)].map((_, index) => (
                        <button
                          onClick={() => handlePageChange(index + 1)}
                          key={index}
                          style={{
                            backgroundColor: "white",
                            color:
                              index + 1 === currentPage ? "blueviolet" : "gray",
                            textDecoration:
                              index + 1 === currentPage ? "underline" : "none",
                          }}
                          className="border-0"
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={handleNextPage}
                        style={{ backgroundColor: "white" }}
                        className="border-0"
                      >
                        {">"}
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSection;
