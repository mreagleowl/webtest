import React, { useState } from "react";

const DEMO_JSON = {
  "title": "Основи охорони праці",
  "num_questions": 3,
  "total_questions": 3,
  "questions": [
    {
      "id": 1,
      "question": "Чи можна працювати на токарному верстаті без інструктажу з охорони праці?",
      "options": [
        "Якщо людина досвідчена",
        "Можна після трьох змін практики",
        "Заборонено",
        "Так, якщо є медична довідка"
      ],
      "correct": [2]
    },
    {
      "id": 2,
      "question": "Який мінімальний вік для роботи на висоті?",
      "options": [
        "16 років",
        "18 років",
        "21 рік",
        "Будь-який, якщо є інструктаж"
      ],
      "correct": [1]
    },
    {
      "id": 3,
      "question": "Що обов'язково мати при роботі з електроінструментом?",
      "options": [
        "Інструкція з охорони праці",
        "Медична довідка",
        "Дозвіл від керівника",
        "Жилет зі світловідбивачем"
      ],
      "correct": [0]
    }
  ]
};

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [json, setJson] = useState(null);
  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    // ТЕСТОВАЯ заглушка
    setJson({ ...DEMO_JSON, total_questions: DEMO_JSON.questions.length, num_questions: DEMO_JSON.questions.length });
    setTitle(DEMO_JSON.title);
    setNumQuestions(DEMO_JSON.questions.length);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!json || !title || !numQuestions) return;
    setSaving(true);
    const toSend = {
      ...json,
      title: title.trim(),
      num_questions: Number(numQuestions),
      total_questions: json.questions.length,
      questions: json.questions,
    };
    try {
      const res = await fetch("/api/themes/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSend),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        setError("Не вдалося зберегти тему!");
      }
    } catch {
      setError("Не вдалося зберегти тему!");
    } finally {
      setSaving(false);
    }
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
      {uploaded && json && (
        <>
          <div className="alert alert-success py-2">
            Завантажено: <b>{uploaded}</b> | Успішно конвертовано <b>{json.questions.length}</b> питань
          </div>
          <div className="card p-3 mb-3">
            <label className="form-label">Назва теми:</label>
            <input type="text" className="form-control mb-2" value={title} onChange={e => setTitle(e.target.value)} />
            <label className="form-label">Кількість питань для тесту:</label>
            <input type="number" className="form-control mb-2" min={1} max={json.questions.length} value={numQuestions} onChange={e => setNumQuestions(e.target.value)} />
            <button className="btn btn-success mt-2" disabled={saving} onClick={handleSave}>Зберегти тему</button>
          </div>
        </>
      )}
      {saved && (
        <div className="alert alert-info py-2 mt-2">Тему додано! Можна проходити тест у списку тем.</div>
      )}
      {json && (
        <pre className="bg-light p-3 rounded small" style={{ maxHeight: 300, overflow: "auto" }}>{JSON.stringify(json, null, 2)}</pre>
      )}
    </div>
  );
}
