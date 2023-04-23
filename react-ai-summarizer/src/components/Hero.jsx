import React from "react";
import Logo from "@/assets/logo.png";

function Hero() {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full pt-3 mb-10">
        <div className="flex items-center">
          <img src={Logo} alt="App logo" width="64px" />
          <span className="sm:text-3xl text-3xl font-bold ml-2 tracking-tight">
            ArticleGPT
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.open("https://github.com/cypherkunp")}
          className="black_btn"
        >
          GitHub
        </button>
      </nav>
      <h1 className="head_text">
        Summarize articles with <br className="max-md:hidden" />
        Open API<span className="purple_gradient"> GPT-4</span>
      </h1>
      <h2 className="desc">
        Simplify your reading with{" "}
        <span className="underline font-medium">ArticleGPT</span>, an open
        source article summarizer that transforms lengthy articles into clear
        and concise summaries
      </h2>
    </header>
  );
}

export default Hero;
