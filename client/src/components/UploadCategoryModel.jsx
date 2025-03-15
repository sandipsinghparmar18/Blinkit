import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

function UploadCategoryModel({ close }) {
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
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
                <p className=" text-sm text-neutral-500">No Image</p>
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  disabled={!data.name}
                  className={`
                ${!data.name ? "bg-gray-400" : "bg-yellow-500"}
                px-4 py-2 rounded cursor-pointer
                `}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadCategoryImage"
                  accept="image/*"
                  name="image"
                  onChange={(e) =>
                    setData({ ...data, image: e.target.files[0] })
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UploadCategoryModel;
