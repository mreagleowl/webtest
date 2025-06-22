import React, { useState } from "react";

const DEMO_JSON = {
  "title": "Основи охорони праці",
  "num_questions": 20,
  "total_questions": 100,
  "questions": [
    {
      "id": 1,
      "question": "Чи можна працювати на токарному верстаті без інструктажу з охорони праці?",
      "answers": [
        "Якщо людина досвідчена",
        "Можна після трьох змін практики",
        "Заборонено",
        "Так, якщо є медична довідка"
      ],
      "correct": [3]
    }
  ]
};

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [json, setJson] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setLogged(true);
      setError(null);
    } else {
      setError("Невірний пароль");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploaded(file.name);
    // Для тесту — просто показуємо DEMO_JSON
    setJson(DEMO_JSON);
  };

  const handleDownload = () => {
    const data = JSON.stringify(json, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${json.title || "questions"}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  if (!logged) {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="card p-4 shadow-sm text-center" style={{ maxWidth: 400 }}>
          <h2 className="mb-4">Вхід в адмінку</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="form-control form-control-lg mb-3"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg w-100">Увійти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-center">Конвертація питань із файлів</h2>
      <div className="mb-3">
        <label className="form-label fs-5">Виберіть файл (Word/txt):</label>
        <input type="file" className="form-control" accept=".txt,.doc,.docx" onChange={handleFile} />
      </div>
      {uploaded && (
        <div className="alert alert-info py-2">
          Завантажено: <b>{uploaded}</b>
        </div>
      )}
      {json && (
        <>
          <div className="alert alert-success py-2">Файл сконвертовано! Ви можете переглянути і зберегти JSON:</div>
          <pre className="bg-light p-3 rounded small" style={{ maxHeight: 300, overflow: "auto" }}>{JSON.stringify(json, null, 2)}</pre>
          <button className="btn btn-success mt-2" onClick={handleDownload}>Завантажити як JSON</button>
        </>
      )}
    </div>
  );
}
