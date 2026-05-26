import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { use } from "react";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const productsPerPage = 6;
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = list.slice(startIndex, endIndex);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
        setPages(Math.ceil(response.data.products.length / productsPerPage));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + "/api/product/remove", { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  useEffect(() => {    
    setPage(1);
  }, [list]);

  return (
    <>
      <p className="mb-2">All Products List</p>

      <div className="flex flex-wrap items-center gap-2 mt-6">
        {[...Array(pages).keys()].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p + 1)}
            className={`mb-2 w-7 h-7 border flex items-center justify-center active:bg-gray-900 ${page === p + 1 ? "bg-black text-white" : "bg-white text-black"} cursor-pointer`}
          >
            {p + 1}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {/* List Table Title */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-400 bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b className="text-center">Category</b>
          <b className="text-center">Price</b>
          <b className="text-center">Quantity</b>
          <b className="text-center">Stock</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}

        {currentProducts.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-400 text-sm"
            key={index}
          >
            <img className="w-12 center" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p className="text-center">{item.category}</p>
            <p className="text-center">
              {currency}
              {item.price}
            </p>
            <p className="text-center">{item.quantity}</p>
            {item.inStock ? (
              <p className="text-green-600 text-center">In Stock</p>
            ) : (
              <p className="text-red-600 text-center">Out of Stock</p>
            )}
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
