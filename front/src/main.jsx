import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <div style={{color:'red', fontSize:'40px'}}>!!! REACT ЖИВОЙ !!!</div>;
}

createRoot(document.getElementById("root")).render(<App />);
