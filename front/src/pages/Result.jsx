import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const score = params.get("score");
  const pib = params.get("pib");
  const error = params.get("error");

  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">Виникла помилка при збереженні результату!</div>
        <Link to="/" className="btn btn-outline-secondary mt-4">На головну</Link>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card p-5 shadow text-center">
        <h2 className="mb-4">Дякуємо, {pib || "учасник"}!</h2>
        <h4 className="mb-3">Ваша оцінка: <span className="text-success">{score}</span></h4>
        <Link to="/" className="btn btn-primary mt-3">Повернутись на головну</Link>
      </div>
    </div>
  );
}
