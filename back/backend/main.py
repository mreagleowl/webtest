# Версия: 1.3.1, Дата: 2025-06-27 UTC

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from datetime import datetime
from backend.services.converter import parse_questions_file

app = FastAPI()

# CORS для фронта
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

QUESTIONS_DIR = os.path.join(os.path.dirname(__file__), "questions")
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "results")

def list_themes():
    result = []
    for fname in os.listdir(QUESTIONS_DIR):
        if fname.endswith(".json"):
            with open(os.path.join(QUESTIONS_DIR, fname), encoding="utf-8") as f:
                data = json.load(f)
                result.append({
                    "id": fname[:-5],
                    "title": data.get("title", ""),
                    "num_questions": data.get("num_questions", 0),
                    "total_questions": len(data.get("questions", []))
                })
    return result

@app.get("/api/themes")
def get_themes():
    return list_themes()

@app.get("/api/questions/{theme_id}")
def get_questions(theme_id: str):
    fpath = os.path.join(QUESTIONS_DIR, theme_id + ".json")
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail="Тема не знайдена")
    with open(fpath, encoding="utf-8") as f:
        data = json.load(f)
#    from random import sample
#    n = min(data["num_questions"], len(data["questions"]))
#    questions = sample(data["questions"], n)
    n = min(data["num_questions"], len(data["questions"]))
    questions = data["questions"][:n]

    for i, q in enumerate(questions):
        q = q.copy()
        q.pop("correct", None)  # не возвращаем правильный ответ
        q["id"] = i + 1
        questions[i] = q
    return {
        "title": data["title"],
        "num_questions": n,
        "questions": questions
    }

@app.post("/api/result")
async def save_result(payload: dict):
    fio = payload.get("fio", "") or payload.get("pib", "")
    theme = payload.get("theme", "")
    answers = payload.get("answers", {})
    fpath = os.path.join(QUESTIONS_DIR, theme + ".json")
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail="Тема не знайдена")
    with open(fpath, encoding="utf-8") as f:
        theme_data = json.load(f)
    original_questions = theme_data["questions"]
    # Сопоставим по qid (id из исходного пула)
    answer_items = []
    correct_count = 0
    total = 0
    # Формируем быстрый поиск по qid
    qid_map = {str(q['id']): q for q in original_questions}
    for qid, user_ans in answers.items():
        q = qid_map.get(str(qid))
        if not q:
            continue
        # Сравниваем множества индексов
        correct_indices = q.get("correct", [])
        if set(user_ans) == set(correct_indices):
            correct_count += 1
        total += 1
        # Только машинные индексы в деталях ответа (0-based!)
        answer_items.append({
            "qid": q["id"],
            "question": q["question"],
            "user_answers": user_ans,
            "correct_answers": correct_indices
        })
    score = correct_count
    percent = (score / total * 100) if total else 0
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    fname = f"{timestamp}_{fio.replace(' ', '_')}_{theme}.json"
    fpath_result = os.path.join(RESULTS_DIR, fname)
    to_save = {
        **payload,
        "score": score,
        "percent": percent,
        "total": total,
        "correct": correct_count,
        "details": answer_items
    }
    with open(fpath_result, "w", encoding="utf-8") as f:
        json.dump(to_save, f, ensure_ascii=False, indent=2)
    return {
        "score": score,
        "percent": percent,
        "total": total,
        "correct": correct_count,
        "details": answer_items
    }

@app.post("/api/admin/convert")
async def convert_questions(
    title: str = Form(...),
    num_questions: int = Form(...),
    file: UploadFile = File(...)
):
    content = (await file.read()).decode("utf-8")
    questions = parse_questions_file(content)
    if not questions:
        raise HTTPException(status_code=400, detail="Помилка у файлі питань")
    data = {
        "title": title,
        "num_questions": num_questions,
        "questions": questions
    }
    fname = title.replace(" ", "_").lower() + ".json"
    fpath = os.path.join(QUESTIONS_DIR, fname)
    with open(fpath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return {"status": "ok", "saved_as": fname}

# --- Новый эндпоинт для загрузки темы из JSON (TXT-конвертер на фронте)
@app.post("/api/themes/upload")
async def upload_theme(request: Request):
    data = await request.json()
    # --- Валидация вариантов на латиницу ---
    bad_options = []
    questions = data.get("questions", [])
    for q_idx, q in enumerate(questions):
        for o_idx, opt in enumerate(q.get("options", [])):
            if isinstance(opt, str) and len(opt) > 1 and opt[1] == "." and opt[0].isalpha() and opt[0].upper() in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
                bad_options.append(f"Питання {q_idx + 1}, варіант {o_idx + 1}: '{opt}'")
    if bad_options:
        raise HTTPException(
            status_code=400,
            detail=("Виявлено варіанти, що починаються з латинської букви (A., B., ...):\n" +
                   "\n".join(bad_options) +
                   "\nВаріанти відповідей повинні починатися з кириличної букви (А., Б., ...).")
        )
    # --- конец валидации ---
    title = data.get("title") or "theme"
    filename = f"{title.replace(' ', '_').lower()}.json"
    path = os.path.join(QUESTIONS_DIR, filename)
    os.makedirs(QUESTIONS_DIR, exist_ok=True)
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Не вдалося зберегти: {e}")
    return {"ok": True, "filename": filename}

# --- Новый эндпоинт: удаление темы по id (имени файла) ---
@app.delete("/api/themes/{theme_id}")
def delete_theme(theme_id: str):
    path = os.path.join(QUESTIONS_DIR, theme_id + ".json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Тема не знайдена")
    os.remove(path)
    return {"ok": True, "deleted": theme_id}

# --- Новый эндпоинт: редактирование темы (названия/кол-ва вопросов) ---
@app.put("/api/themes/{theme_id}")
def update_theme(theme_id: str, payload: dict):
    path = os.path.join(QUESTIONS_DIR, theme_id + ".json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Тема не знайдена")
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    # Обновить поля
    title = payload.get("title")
    num_questions = payload.get("num_questions")
    if title is not None:
        data["title"] = title
    if num_questions is not None:
        data["num_questions"] = int(num_questions)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return {"ok": True, "theme": theme_id, "updated": True}
