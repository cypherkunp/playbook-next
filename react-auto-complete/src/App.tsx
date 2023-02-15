import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="w-full h-16 bg-green-300"></header>
      <main className="w-full h-screen flex flex-col items-center justify-start mt-32">
        <p className="text-2xl font-bold text-gray-700">Hello</p>
      </main>
    </div>
  );
}

export default App;
