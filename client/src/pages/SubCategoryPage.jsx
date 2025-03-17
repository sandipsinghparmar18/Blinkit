import React, { useEffect, useState } from "react";
import UploadSubCategory from "../components/UploadSubCategory";
import { useToast } from "../context/ToastContext";
import Axios from "../utils/Axios";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";

function SubCategoryPage() {
  const { addToast } = useToast();
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  let column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className=" flex items-center justify-center">
            <img
              className="h-8 w-8"
              src={row.original.image}
              alt={row.original.name}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
    }),
  ];
  const fetchsubcategory = async () => {
    try {
      setLoading(true);
      const response = await Axios.post("/api/subcategory/get");
      setData(response.data.data);
      addToast("data fetched successfully", "success");
    } catch (error) {
      addToast("Failed to fetch subcategories", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchsubcategory();
  }, []);
  console.log("SubCategoryPage", data);
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className=" font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-yellow-400 hover:bg-yellow-400 px-3 py-1 rounded cursor-pointer"
        >
          Add SubCategory
        </button>
      </div>
      <div>
        <DisplayTable data={data} column={column} />
      </div>
      {openAddSubCategory && (
        <UploadSubCategory close={() => setOpenAddSubCategory(false)} />
      )}
    </section>
  );
}

export default SubCategoryPage;
