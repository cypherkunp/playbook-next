import React from "react";

function Error({ errorData }) {
  return (
    <p className="font-inter font-bold text-black text-center">
      Well that wasn't suppose to happen, please try again. <br />
      <span className="font-satoshi font-normal text-gray-700 ">
        {errorData}
      </span>
    </p>
  );
}

export default Error;
