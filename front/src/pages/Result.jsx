import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Result() {
  const [searchParams] = useSearchParams();
  const score = searchParams.get("score");
  const percent = searchParams.get("percent");
  const pib = searchParams.get("pib");
  const total = searchParams.get("total");
  const correct = searchParams.get("correct");
  const error = searchParams.get("error");
  const navigate = useNavigate();

  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", maxWidth: 700 }}>
      <div className="card p-4 shadow" style={{ maxWidth: 500 }}>
        <h2 className="mb-3 text-center">Результат тесту</h2>
        {error ? (
          <div className="alert alert-danger mb-3">Помилка при збереженні результату</div>
        ) : (
          <>
            <div className="mb-2 fs-5 text-center">Дякуємо, <b>{pib}</b>!</div>
            <div className="mb-2 text-center">Ваша оцінка: <b>{score}</b> із <b>{total}</b></div>
            <div className="mb-2 text-center">Процент правильних: <b>{percent}%</b></div>
            <div className="mb-2 text-center">Правильних відповідей (correct, машинні індекси): <b>{correct}</b></div>
          </>
        )}
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-primary" onClick={() => navigate("/")}>На головну</button>
        </div>
      </div>
    </div>
  );
}
