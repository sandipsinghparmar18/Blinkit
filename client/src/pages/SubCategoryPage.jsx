import React, { useEffect, useState } from "react";
import UploadSubCategory from "../components/UploadSubCategory";
import { useToast } from "../context/ToastContext";
import Axios from "../utils/Axios";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory";

function SubCategoryPage() {
  const { addToast } = useToast();
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [imageUrl, setImageurl] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [editSubData, setEditSubData] = useState({
    _id: "",
  });
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
              className="h-8 w-8 cursor-pointer"
              src={row.original.image}
              alt={row.original.name}
              onClick={() => {
                setImageurl(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((c, index) => {
              return (
                <p
                  key={c._id + "table"}
                  className=" bg-slate-100 shadow-md px-1 inline-block"
                >
                  {c.name}
                </p>
              );
            })}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className=" flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setOpenEditSubCategory(true);
                setEditSubData(row.original);
              }}
              className="p-2 bg-green-100 rounded-full hover:text-green-600 cursor-pointer"
            >
              <MdEdit size={20} />
            </button>
            <button className="p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600 cursor-pointer">
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
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
      {imageUrl && <ViewImage url={imageUrl} close={() => setImageurl("")} />}
      {openEditSubCategory && (
        <EditSubCategory
          data={editSubData}
          close={() => setOpenEditSubCategory(false)}
          fetchData={fetchsubcategory}
        />
      )}
    </section>
  );
}

export default SubCategoryPage;
