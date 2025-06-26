# ... Импорт и роутеры опущены для краткости
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
from datetime import datetime

app = FastAPI()

# ... настройка CORS, маршрутов, прочее опущено для краткости ...

# /api/result — только машинные индексы (0-based!)
@app.post("/api/result")
async def save_result(payload: dict):
    pib = payload.get("pib")
    theme = payload.get("theme")
    answers = payload.get("answers", {})
    dt = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = Path("results") / f"{dt}_{pib}_{theme}.json"

    # Загрузка темы
    theme_file = Path("questions") / f"{theme}.json"
    with open(theme_file, encoding="utf-8") as f:
        theme_data = json.load(f)

    question_map = {str(q["id"]): q for q in theme_data["questions"]}

    details = []
    correct_count = 0
    for qid, user_ans in answers.items():
        q = question_map.get(str(qid))
        correct_indices = q.get("correct", [])
        is_right = set(user_ans) == set(correct_indices)
        if is_right:
            correct_count += 1
        details.append({
            "qid": int(qid),
            "user_answers": user_ans,            # только 0-based!
            "correct_answers": correct_indices,  # только 0-based!
            "is_correct": is_right
        })

    total = len(theme_data["questions"])
    score = correct_count
    percent = round(100 * score / total, 2) if total else 0.0

    out = {
        "pib": pib,
        "theme": theme,
        "date": dt,
        "score": score,
        "percent": percent,
        "total": total,
        "correct": correct_count,
        "details": details,
    }

    results_file.parent.mkdir(parents=True, exist_ok=True)
    with open(results_file, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    return {
        "score": score,
        "percent": percent,
        "total": total,
        "correct": correct_count,
        # детали можно добавить во фронт по желанию
    }

# ... остальные эндпоинты ...
