import React, { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: "",
    });

  const addToCart = async (itemId, size) => {
    try {
      if (!size) {
        toast.error("Select Product Size");
        return;
      }

      let cartData = structuredClone(cartItems);

      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
      setCartItems(cartData);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === itemId
            ? {
              ...product,
              quantity: product.quantity - 1,
              inStock: product.quantity - 1 > 0,
            }
            : product
        )
      );

      if (token) {
        try {
          await axios.post(backendUrl + "/api/cart/add", { itemId, size }, { headers: { token } });
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    try {
      let cartData = structuredClone(cartItems);

      cartData[itemId][size] = quantity;

      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity }, { headers: { token } });
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartAmount = () => {
    try {
      let totalAmount = 0;
      for (const items in cartItems) {
        let itemInfo = products.find((product) => product._id === items);
        for (const item in cartItems[items]) {
          try {
            if (cartItems[items][item] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      return totalAmount;
    } catch (error) {
      console.log(error);
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } });

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const getAddress = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/address/get",
        { email: email },
        { headers: { token } },
      );
      if (data.success) {
        const address = data.address;
        setFormData((data) => ({
          ...data,
          firstName: address.firstName,
          lastName: address.lastName,
          email: address.email,
          street: address.street,
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
          country: address.country,
          phone: address.phone,
        }));
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, [page]);

  useEffect(() => {
    getUserCart(token);
  }, [token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
      setUserName(localStorage.getItem("userName"));
      setEmail(localStorage.getItem("email"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    userName,
    setUserName,
    email,
    setEmail,
    page,
    setPage,
    pages,
    setPages,
    formData,
    setFormData,
    getAddress
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
