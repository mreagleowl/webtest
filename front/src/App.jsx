import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Themes from "./pages/Themes";
// Импорт других страниц позже (Test, Pib, Result, Admin)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/themes" element={<Themes />} />
        {/* <Route path="/test" element={<Test />} /> */}
        {/* <Route path="/pib" element={<Pib />} /> */}
        {/* <Route path="/result" element={<Result />} /> */}
        {/* <Route path="/admin" element={<Admin />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
