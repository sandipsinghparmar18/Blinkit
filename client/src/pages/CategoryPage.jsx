import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import EditCategory from "../components/EditCategory";
import ConformBox from "../components/ConformBox";
import { useToast } from "../context/ToastContext";
import { useSelector } from "react-redux";

function CategoryPage() {
  const { addToast } = useToast();
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    image: "",
  });
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });
  // const allCategory = useSelector((state) => state.product.allCategory);
  // useEffect(() => {
  //   setCategoryData(allCategory);
  // }, [allCategory]);
  const fetchCategry = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/category/get");
      setCategoryData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      //setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategry();
  }, []);
  const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      await Axios.delete(`/api/category/delete/${deleteCategory._id}`);
      setOpenConfirmBoxDelete(false);
      addToast("Successfully deleted category", "success");
      fetchCategry();
      setLoading(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      addToast("Error! Failed to delete category.", "error");
      setLoading(false);
    }
  };
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
      {!categoryData[0] && !loading && <NoData />}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
        {categoryData.map((category, index) => {
          return (
            <div key={category._id} className="w-32 h-56 rounded shadow-md">
              <img
                src={category.image}
                alt={category.name}
                className="w-full object-scale-down "
              />
              <div className="flex items-center h-9 gap-2">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(category);
                  }}
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 cursor-pointer rounded "
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenConfirmBoxDelete(true);
                    setDeleteCategory(category);
                  }}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 cursor-pointer rounded "
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {loading ? <Loading /> : null}
      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategry}
          close={() => setOpenUploadCategory(false)}
        />
      )}
      {openEdit && (
        <EditCategory
          data={editData}
          fetchData={fetchCategry}
          close={() => setOpenEdit(false)}
        />
      )}
      {openConfirmBoxDelete && (
        <ConformBox
          close={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
}

export default CategoryPage;
