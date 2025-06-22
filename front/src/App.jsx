import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Themes from "./pages/Themes";
import Pib from "./pages/Pib";
import Test from "./pages/Test";
import Result from "./pages/Result";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/pib" element={<Pib />} />
        <Route path="/test" element={<Test />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
