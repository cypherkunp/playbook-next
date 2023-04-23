import React from "react";
import Hero from "@/components/Hero.jsx";
import Demo from "@/components/Demo.jsx";

import "@/App.css";

function App() {
  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>

      <div className="app">
        <Hero></Hero>
        <Demo></Demo>
      </div>
    </main>
  );
}

export default App;
