import csv
import json
import random
import re

# مسار ملف CSV
csv_file = 'your_file.csv'  # غيّر الاسم حسب اسم الملف الحقيقي
json_output = 'output.json'

# اقرأ البيانات من الملف
pairs = []
with open(csv_file, 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    for row in reader:
        if row and row[2]:  # العمود الثالث فيه البيانات
            match = re.match(r'\d+\.\s*(.*?)\s*→\s*(.*)', row[2])
            if match:
                wrong, correct = match.groups()
                pairs.append((wrong.strip(), correct.strip()))

# أنشئ مصفوفة JSON
all_corrects = [correct for _, correct in pairs]
data = []

for wrong, correct in pairs:
    # اختار 3 خيارات عشوائية غير الصحيحة
    distractors = random.sample([c for c in all_corrects if c != correct], 3)
    options = distractors + [correct]
    random.shuffle(options)

    item = {
        "question": f"Do not say: {wrong} , say:",
        "options": options,
        "answer": correct
    }
    data.append(item)

# احفظ النتيجة في ملف JSON
with open(json_output, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ تم حفظ الملف: {json_output}")
