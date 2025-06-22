import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Pib() {
  const [searchParams] = useSearchParams();
  const themeId = searchParams.get("theme");
  const [pib, setPib] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pib.trim()) {
      setError("Будь ласка, введіть ПІБ.");
      return;
    }
    navigate(`/test?theme=${encodeURIComponent(themeId)}&pib=${encodeURIComponent(pib)}`);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h2 className="mb-4">Введіть ПІБ для початку тестування</h2>
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="ПІБ"
            value={pib}
            onChange={(e) => { setPib(e.target.value); setError(null); }}
            autoFocus
          />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg w-100">Далі</button>
      </form>
    </div>
  );
}
