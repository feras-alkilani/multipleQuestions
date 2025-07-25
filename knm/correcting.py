import json

def update_answers_in_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)  # data قائمة من الأسئلة

    letter_to_index = {'A': 0, 'B': 1, 'C': 2, 'D': 3}

    for item in data:
        answer_letter = item.get('answer', '').upper()
        options = item.get('options', [])
        if answer_letter in letter_to_index:
            idx = letter_to_index[answer_letter]
            if idx < len(options):
                item['answer'] = options[idx]

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# استبدل هنا باسم ملفك
update_answers_in_file('knm.json')
