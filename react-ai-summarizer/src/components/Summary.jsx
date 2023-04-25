import React from "react";

function Summary({ text: summary }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-satoshi font-bold text-gray-600 text-xl ">
        Article <span className="blue_gradient">Summary</span>
      </h2>
      <div className="summary_box">
        <p className="font-inter font-medium text-sm text-gray-700">
          {summary}
        </p>
      </div>
    </div>
  );
}

export default Summary;
