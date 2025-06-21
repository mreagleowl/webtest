import re

def parse_questions_file(text: str):
    blocks = re.split(r'\n\s*\n', text.strip())
    questions = []
    for block in blocks:
        lines = block.strip().split('\n')
        if not lines or len(lines) < 3:
            continue
        question_match = re.match(r'^\d+\.\s*(.*)', lines[0])
        if not question_match:
            continue
        question_text = question_match.group(1)
        options = []
        for l in lines[1:-1]:
            opt_match = re.match(r'^([А-ЯІЇЄҐ])\.\s*(.*)', l)
            if opt_match:
                options.append(opt_match.group(2))
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
    return questions
