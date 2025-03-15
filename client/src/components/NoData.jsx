import React from "react";
import noDataImage from "../assets/nodata.webp";

function NoData() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <img src={noDataImage} alt="No data Image" className="w-36" />
      <p className="text-neutral-500">No data</p>
    </div>
  );
}

export default NoData;
