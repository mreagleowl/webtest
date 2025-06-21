import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Test() {
  const [params] = useSearchParams();
  const theme = params.get("theme") || "";
  const fio = params.get("fio") || "";
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/questions?theme=${theme}`)
      .then((r) => r.json())
      .then(setQuestions);
  }, [theme]);

  if (!questions.length) return <div className="min-h-screen flex items-center justify-center text-lg">Завантаження...</div>;

  const q = questions[step];

  const handleChange = (idx) => {
    setAnswers((prev) => ({
      ...prev,
      [step]: prev[step]?.includes(idx)
        ? prev[step].filter((x) => x !== idx)
        : [...(prev[step] || []), idx],
    }));
  };

  const handleFinish = () => {
    // можна доопрацювати відправку результатів
    navigate("/result", { state: { fio, theme, answers } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-xl p-6 bg-yellow-50 rounded-2xl shadow-lg mb-4">
        <div className="text-gray-600 mb-2">
          <span className="font-bold">Питання {step + 1} із {questions.length}</span>
        </div>
        <div className="text-xl font-semibold mb-4">{q.question}</div>
        <div className="flex flex-col gap-2 mb-6">
          {q.answers.map((a, idx) => (
            <label key={idx} className="flex items-center gap-2 text-lg">
              <input
                type="checkbox"
                checked={answers[step]?.includes(idx) || false}
                onChange={() => handleChange(idx)}
                className="accent-blue-600"
              />
              {a}
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="bg-gray-200 hover:bg-gray-300 rounded-xl px-6 py-2 text-lg"
            disabled={step === 0}
          >
            Назад
          </button>
          {step < questions.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(questions.length - 1, s + 1))}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 text-lg"
            >
              Вперед
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-2 text-lg"
            >
              Завершити
            </button>
          )}
        </div>
        {/* Прогрес-лента */}
        <div className="flex gap-1 mt-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-xl ${answers[i] ? "bg-blue-600" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
