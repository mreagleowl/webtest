import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Test() {
  const [searchParams] = useSearchParams();
  const themeId = searchParams.get("theme");
  const pib = searchParams.get("pib");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/questions/${encodeURIComponent(themeId)}`)
      .then((res) => res.json())
      .then((data) => {
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else if (Array.isArray(data.questions)) arr = data.questions;
        setQuestions(arr);
        setLoading(false);
      })
      .catch(() => {
        setError("Не вдалося завантажити питання.");
        setLoading(false);
      });
  }, [themeId]);

  if (loading) return <div className="text-center mt-5">Завантаження...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;
  if (!questions || !questions.length) return <div className="alert alert-info mt-4 text-center">Немає питань для цієї теми.</div>;

  const q = questions[current];
  const options = Array.isArray(q.options) ? q.options : (q.answers || []);
  const isMulti = true;

  const handleAnswer = (answerIdx) => {
    let newAnswers = { ...answers };
    newAnswers[q.id] = newAnswers[q.id] || [];
    if (newAnswers[q.id].includes(answerIdx)) {
      newAnswers[q.id] = newAnswers[q.id].filter((a) => a !== answerIdx);
    } else {
      newAnswers[q.id] = [...newAnswers[q.id], answerIdx];
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleFinish = () => {
    // Удаляем неотвеченные вопросы
    const filteredAnswers = Object.fromEntries(
      Object.entries(answers).filter(([qid, arr]) => arr && arr.length > 0)
    );
    fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pib,
        theme: themeId,
        answers: filteredAnswers,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        navigate(`/result?score=${data.score || 0}&percent=${data.percent || 0}&total=${data.total || 0}&correct=${data.correct || 0}&pib=${encodeURIComponent(pib)}`);
      })
      .catch(() => {
        navigate(`/result?error=1`);
      });
  };

  // --- Новый прогресс-бар: горизонтальные сегменты, кликабельные ---
  const renderProgressBar = () => (
    <div className="w-100 mb-4 d-flex flex-row align-items-center justify-content-center" style={{gap: 6, minHeight: 18}}>
      {questions.map((qst, idx) => {
        const answered = answers[qst.id] && answers[qst.id].length > 0;
        const active = idx === current;
        return (
          <div
            key={qst.id}
            style={{
              flex: 1,
              height: 14,
              minWidth: 24,
              maxWidth: 50,
              background: answered ? "#198754" : "#e9ecef",
              borderRadius: 3,
              border: active ? '2.5px solid #0d6efd' : '1px solid #adb5bd',
              transition: 'all 0.15s',
              cursor: 'pointer',
              boxShadow: active ? '0 0 8px #0d6efd22' : ''
            }}
            title={`Перейти до питання ${idx + 1}`}
            onClick={() => setCurrent(idx)}
          />
        );
      })}
    </div>
  );

  return (
    <div className="container py-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", maxWidth: 700 }}>
      {renderProgressBar()}
      <h4 className="mb-3">Питання {current + 1} з {questions.length}</h4>
      <div className="mb-4 w-100">
        <div className="fs-5 mb-2">{q.question}</div>
        {(options || []).map((ans, idx) => (
          <div className="form-check mb-2" key={idx}>
            <input
              className="form-check-input"
              type="checkbox"
              name={`q_${q.id}_${idx}`}
              id={`q_${q.id}_a${idx}`}
              checked={answers[q.id]?.includes(idx) || false}
              onChange={() => handleAnswer(idx)}
            />
            <label className="form-check-label" htmlFor={`q_${q.id}_a${idx}`}>
              {ans}
            </label>
          </div>
        ))}
        <div className="form-text">Можна обрати одну або декілька відповідей</div>
      </div>
      <div className="d-flex justify-content-between w-100">
        <button className="btn btn-secondary" disabled={current === 0} onClick={handlePrev}>Назад</button>
        {current < questions.length - 1 ? (
          <button className="btn btn-primary" onClick={handleNext}>Вперед</button>
        ) : (
          <button className="btn btn-success" onClick={handleFinish}>Завершити</button>
        )}
      </div>
    </div>
  );
}
