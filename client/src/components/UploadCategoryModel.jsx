import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useToast } from "../context/ToastContext";
import Axios from "../utils/Axios";

function UploadCategoryModel({ close, fetchData }) {
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, image: file });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.image) {
      addToast("All fields are required", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("name", data.name);
    try {
      setLoading(true);
      const response = await Axios.post("/api/category/addCategory", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addToast("Category added successfully.", "success");
      setLoading(false);
      close();
      fetchData();
    } catch (error) {
      setLoading(false);
      addToast("Error! Failed to add category.", "error");
    }
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800/60 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Category</h1>
          <button className="w-fit block ml-auto cursor-pointer">
            <IoMdClose size={24} onClick={close} />
          </button>
        </div>
        <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-2 border border-blue-100 focus-within:border-yellow-400 outline-none rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {data.image ? (
                  <img
                    src={
                      typeof data.image === "string"
                        ? data.image
                        : URL.createObjectURL(data.image)
                    }
                    alt="Category"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className=" text-sm text-neutral-500">No Image</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  className={
                    "border-yellow-300 hover:bg-yellow-500 px-4 py-2 rounded cursor-pointer border font-medium"
                  }
                >
                  {loading ? "Loading..." : "Upload Image"}
                </div>
                <input
                  type="file"
                  id="uploadCategoryImage"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className={`
              ${
                data.name && data.image
                  ? "bg-yellow-400 hover:bg-amber-400"
                  : "bg-gray-300"
              }
              py-2 rounded font-semibold  
            `}
          >
            Add Category
          </button>
        </form>
      </div>
    </section>
  );
}

export default UploadCategoryModel;
