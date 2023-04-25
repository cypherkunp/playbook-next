import React, { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "@/assets";
import { useLazyGetSummaryQuery } from "@/services/article.api";
import Summary from "./Summary";
import Spinner from "./Spinner";
import Error from "./Error";
import HistoryLink from "./HistoryLink";

function Demo() {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const allArticlesFromLocalStorage = localStorage.getItem("articles");
    if (allArticlesFromLocalStorage) {
      setAllArticles(JSON.parse(allArticlesFromLocalStorage));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedArticles = [...allArticles, newArticle];
      setArticle(newArticle);
      setAllArticles(updatedArticles);
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
    }
  };

  return (
    <section className="w-full mt-16 max-w-xl">
      <div className="w-full flex flex-col gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link icon"
            className="absolute  left-0 my-2  ml-3 w-5 "
          />

          <input
            type="url"
            placeholder="Enter a url"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value });
            }}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ⏎
          </button>
        </form>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((article) => (
            <HistoryLink article={article} setArticle={setArticle} />
          ))}
        </div>
      </div>
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <Spinner />
        ) : error ? (
          <Error errorData={error?.data?.error} />
        ) : (
          article.summary && <Summary text={article.summary} />
        )}
      </div>
    </section>
  );
}

export default Demo;
