import json
from collections import Counter

# اسم ملف الإدخال
input_file = 'enToDuQuestions.json'
# اسم ملف الإخراج
output_file = 'duplicate_questions.txt'

# تحميل البيانات
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# تأكد من أن البيانات عبارة عن قائمة
if not isinstance(data, list):
    raise ValueError("الملف يجب أن يحتوي على مصفوفة من الكائنات.")

# جمع كل الأسئلة
questions = [item.get("question", "").strip() for item in data if "question" in item]

# عدّ التكرارات
counts = Counter(questions)

# استخراج الأسئلة المكررة فقط
duplicates = [q for q, count in counts.items() if count > 1]

# حفظها في ملف نصي
with open(output_file, 'w', encoding='utf-8') as f:
    for question in duplicates:
        f.write(question + '\n')

print(f"تم العثور على {len(duplicates)} سؤال مكرر. تم حفظها في '{output_file}'.")
