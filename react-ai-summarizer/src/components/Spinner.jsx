import { loader } from "@/assets";
import React from "react";

function Spinner() {
  return (
    <img
      src={loader}
      alt="loading spinner"
      className="w-10 h-10 object-contain"
    />
  );
}

export default Spinner;
