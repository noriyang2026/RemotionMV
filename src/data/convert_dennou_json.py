import csv
import json

raw_csv = r"C:\WATSON_APP\RemotionMV\src\data\dennou_override_raw.csv"
output_json = r"C:\WATSON_APP\RemotionMV\src\data\dennou_override.json"

items = []
with open(raw_csv, "r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
with open(raw_csv, "r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    for i, row in enumerate(reader):
        if not row or len(row) < 3: continue
        # Handle cases where text contains commas
        text = ",".join(row[:-2]).strip()
        start = float(row[-2])
        end = float(row[-1])
        item = {
            "id": i + 1,
            "text": text.strip(),
            "start": float(start),
            "end": float(end),
            "vfx": "default",
            "tag": "[LOG]"
        }
        
        # VFX Phase Mapping
        idx = i + 1
        if idx <= 3: # Intro
            item["vfx"] = "phase1_boot"
            item["tag"] = "[SYSTEM]"
        elif idx <= 10: # Verse 1 + Pre-Chorus
            item["vfx"] = "phase2_hack"
            item["tag"] = "[QUERY]" if idx > 7 else "[LOG]"
        elif idx <= 15: # Chorus 1
            item["vfx"] = "phase3_reboot"
            item["tag"] = "[SYNC]"
        elif idx <= 22: # Verse 2 + Pre-Chorus
            item["vfx"] = "phase4_dive"
            item["tag"] = "[DIVE]"
        elif idx <= 27: # Chorus 2
            item["vfx"] = "phase5_update"
            item["tag"] = "[UPDATE]"
        elif idx <= 35: # Bridge + Final Chorus
            item["vfx"] = "phase6_finale"
            item["tag"] = "[FINAL]" if idx > 30 else "[BRIDGE]"
            if idx == 35: item["vfx"] = "phase6_finale_sudo"
        elif idx <= 38: # Outro
            if idx == 38: 
                item["vfx"] = "phase6_finale_sudo"
                item["tag"] = "[COMPLETE]"
            else:
                item["vfx"] = "phase6_finale"
                item["tag"] = "[OUTRO]"

        items.append(item)

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(items, f, indent=4, ensure_ascii=False)

print(f"Conversion complete: {output_json}")
