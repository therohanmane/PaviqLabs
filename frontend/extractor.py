import re
import os

log_path = r"c:\Users\Administrator\.gemini\antigravity\brain\713dddc7-cd74-4f37-add4-faee9c80f860\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

in_file = False
file_lines = []

for line in lines:
    if "File Path: `file:///c:/Users/Administrator/Downloads/paviqlabs-fullstack/paviqlabs/frontend/src/index.css`" in line:
        in_file = True
        file_lines = []
        continue
    if in_file:
        if "The above content shows the entire" in line or "Total Bytes:" in line or "Showing lines" in line or "The following code has been modified" in line:
            continue
        if line.startswith("Tool call ") or line.startswith("│"):
            in_file = False
            continue
        
        # Remove the leading line number like "1: "
        m = re.match(r'^\d+:\s?(.*)', line)
        if m:
            file_lines.append(m.group(1))
        elif line.strip() == "---":
             in_file = False
             continue
        else:
             file_lines.append(line.rstrip('\n'))

with open('reverted_index.css', 'w', encoding='utf-8') as f:
    f.write('\n'.join(file_lines))

print(f"Extracted {len(file_lines)} lines to reverted_index.css")
