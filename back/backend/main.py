from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
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
    from random import sample
    n = min(data["num_questions"], len(data["questions"]))
    questions = sample(data["questions"], n)
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
    fio = payload.get("fio", "")
    theme = payload.get("theme", "")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    fname = f"{timestamp}_{fio.replace(' ', '_')}_{theme}.json"
    fpath = os.path.join(RESULTS_DIR, fname)
    with open(fpath, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return {"status": "ok"}

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

