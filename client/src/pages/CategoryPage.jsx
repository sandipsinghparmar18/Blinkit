import React, { useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";

function CategoryPage() {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className=" font-semibold">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm border border-yellow-400 hover:bg-yellow-400 px-3 py-1 rounded cursor-pointer"
        >
          Add Category
        </button>
      </div>
      {openUploadCategory && (
        <UploadCategoryModel close={() => setOpenUploadCategory(false)} />
      )}
    </section>
  );
}

export default CategoryPage;
