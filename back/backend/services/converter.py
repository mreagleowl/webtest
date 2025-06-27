# Версия: 1.3.2, Дата: 2025-06-26 UTC

import re

def parse_questions_file(text: str):
    """
    Парсинг текстового файла с питаннями і варіантами відповідей.
    Якщо хоч один варіант починається з латинської букви (A., B., ...),
    парсер збирає всі такі рядки, а потім зупиняє імпорт і виводить список помилок.
    Всі варіанти повинні починатися з кириличної букви (А., Б., ...).
    """
    blocks = re.split(r'\n\s*\n', text.strip())
    questions = []
    errors = []
    for block_num, block in enumerate(blocks, 1):
        lines = block.strip().split('\n')
        if not lines or len(lines) < 3:
            continue
        question_match = re.match(r'^\d+\.\s*(.*)', lines[0])
        if not question_match:
            continue
        question_text = question_match.group(1)
        options = []
        for opt_idx, l in enumerate(lines[1:-1], 1):
            if re.match(r'^[A-Z]\.\s', l):
                errors.append(
                    f"Питання {block_num}, варіант {opt_idx}: '{l}' — починається з латинської букви!"
                )
            elif not re.match(r'^[А-ЯІЇЄҐ]\.\s', l):
                errors.append(
                    f"Питання {block_num}, варіант {opt_idx}: '{l}' — некоректний формат (має бути кирилиця)!"
                )
            else:
                opt_match = re.match(r'^([А-ЯІЇЄҐ])\.\s*(.*)', l)
                if opt_match:
                    options.append(opt_match.group(2))
        if not options:
            errors.append(
                f"Питання {block_num}: жодного коректного варіанту відповіді! Перевірте формат."
            )
        correct_line = lines[-1]
        correct_match = re.search(r'Правильна відповідь:\s*([А-ЯІЇЄҐ](?:,\s*[А-ЯІЇЄҐ])*)', correct_line)
        if not correct_match:
            continue
        correct_letters = [c.strip() for c in correct_match.group(1).split(",")]
        correct_indices = [ord(l) - ord("А") + 1 for l in correct_letters]
        questions.append({
            "question": question_text,
            "options": options,
            "correct": correct_indices
        })
    if errors:
        raise Exception("\n".join(["ПОМИЛКА: Виявлено проблеми у варіантах відповідей:"] + errors))
    return questions
