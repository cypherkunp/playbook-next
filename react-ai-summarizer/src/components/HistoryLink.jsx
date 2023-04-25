import { copy, tick } from "@/assets";
import React, { useState } from "react";

function HistoryLink({ article, setArticle }) {
  const [copied, setCopied] = useState("");

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => {
      setCopied("");
    }, 3000);
  };

  return (
    <a
      key={article.url}
      className="link_card"
      onClick={() => {
        setArticle(article);
      }}
    >
      <div
        className="copy_btn"
        onClick={() => {
          handleCopy(article.url);
        }}
      >
        <img
          src={copied === article.url ? tick : copy}
          alt="copy button"
          className="w-[40%] h-[40%] object-contain"
        />
      </div>

      <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
        {article.url}
      </p>
    </a>
  );
}

export default HistoryLink;
