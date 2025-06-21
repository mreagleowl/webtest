import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config";
import ProgressBar from "../components/ProgressBar";

export default function Test() {
  const [params] = useSearchParams();
  const theme = params.get("theme");
  const fio = params.get("fio");
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/questions/${theme}`).then(r => r.json()).then(setData);
  }, [theme]);

  if (!data) return <div className="text-center mt-10">Завантаження...</div>;

  const total = data.questions.length;
  const q = data.questions[current];

  function setAnswer(opt) {
    setAnswers({
      ...answers,
      [current]: answers[current]
        ? answers[current].includes(opt)
          ? answers[current].filter(x => x !== opt)
          : [...answers[current], opt]
        : [opt],
    });
  }

  function handleFinish() {
    fetch(`${API_BASE}/result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fio,
        theme,
        answers,
        timestamp: Date.now(),
      }),
    }).then(() =>
      navigate(`/result?theme=${theme}&fio=${encodeURIComponent(fio)}`)
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 bg-white rounded-xl shadow">
      <div className="mb-4 text-gray-600">
        <b>Питання {current + 1} з {total}</b>
      </div>
      <div className="text-lg mb-2">{q.question}</div>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, idx) => (
          <label key={idx} className="block">
            <input
              type="checkbox"
              checked={answers[current]?.includes(idx + 1) || false}
              onChange={() => setAnswer(idx + 1)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
      </div>
      <ProgressBar
        total={total}
        answers={Array.from({ length: total }, (_, i) => !!answers[i])}
        current={current}
        onJump={i => setCurrent(i)}
      />
      <div className="flex gap-2 mt-6 justify-between">
        <button
          className="px-4 py-2 rounded bg-gray-200"
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          Назад
        </button>
        {current < total - 1 ? (
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}
          >
            Далі
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded bg-green-600 text-white"
            onClick={handleFinish}
          >
            Завершити
          </button>
        )}
      </div>
    </div>
  );
}
