import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useToast } from "../context/ToastContext";
import Axios from "../utils/Axios";

function UploadSubCategory({ close, fetchData }) {
  const { addToast } = useToast();
  const [data, setData] = useState({
    name: "",
    image: "",
    category: [],
  });
  const allCategory = useSelector((state) => state.product.allCategory);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, image: file });
    }
  };
  const handleChangeCategory = (e) => {
    const categoryDetails = allCategory.find((el) => el._id == e.target.value);
    if (!data.category.some((el) => el._id === categoryDetails._id)) {
      setData({ ...data, category: [...data.category, categoryDetails] });
    }
  };
  const handleRemoveCategory = (categoryId) => {
    setData({
      ...data,
      category: data.category.filter((el) => el._id !== categoryId),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.image || !data.category.length) {
      addToast("All fields are required", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await Axios.post("/api/subcategory/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchData();
      addToast("Subcategory uploaded successfully", "success");
      close();
    } catch (error) {
      console.error(error);
      addToast("Failed to upload subcategory", "error");
    } finally {
      setLoading(false);
    }
  };

  console.log(data);
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/80 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white p-4 rounded">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Add Sub Categry</h1>
          <button onClick={close} className=" cursor-pointer">
            <IoClose size={25} />
          </button>
        </div>
        <form className="my-3 grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleChange}
              className=" p-2 bg-blue-50 outline-none border focus-within:border-yellow-400 rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center">
                {!data.image ? (
                  <p className=" text-sm text-neutral-400">No Image</p>
                ) : (
                  <img
                    src={
                      typeof data.image === "string"
                        ? data.image
                        : URL.createObjectURL(data.image)
                    }
                    alt="Sub Category"
                    className="w-full h-full object-scale-down"
                  />
                )}
              </div>
              <label htmlFor="uploadImage">
                <div className="px-4 py-1 border border-yellow-400 text-yellow-500 rounded cursor-pointer hover:bg-yellow-400 hover:text-neutral-900">
                  Upload
                </div>
                <input
                  type="file"
                  name="image"
                  id="uploadImage"
                  className=" hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          <div className=" grid gap-1">
            <label htmlFor="selectCategory">Select Category</label>
            <div className=" border focus-within:border-yellow-400 rounded ">
              {/* display value */}
              <div className="flex flex-wrap gap-2">
                {data.category.map((cat, index) => {
                  return (
                    <p
                      key={cat._id + "selected"}
                      className="bg-white shadow-md px-1 m-1 flex items-center gap-2"
                    >
                      {cat.name}
                      <div
                        className=" cursor-pointer hover:text-red-600"
                        onClick={() => handleRemoveCategory(cat._id)}
                      >
                        <IoClose size={20} />
                      </div>
                    </p>
                  );
                })}
              </div>
              {/* select category */}
              <select
                id="selectCategory"
                className="w-full p-2 bg-transparent outline-none border"
                onChange={handleChangeCategory}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((category, index) => {
                  return (
                    <option
                      value={category?._id}
                      key={category._id + "subcategory"}
                    >
                      {category?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={
              !data.name || !data.image || !data.category.length || loading
            }
            className={`px-4 py-2 border font-semibold cursor-pointer transition-colors
            ${
              !data.name || !data.image || !data.category.length || loading
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }
             `}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default UploadSubCategory;
