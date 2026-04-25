import os

PROJECT_ROOT = os.getcwd()

REPORT_FILE = "project_structure_report.txt"

# folders to ignore
IGNORE_FOLDERS = {
    "node_modules",
    ".git",
    "__pycache__",
    "venv",
    ".venv",
    "dist",
    "build"
}


def print_tree(start_path):

    structure = []

    for root, dirs, files in os.walk(start_path):

        # remove ignored folders
        dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]

        level = root.replace(start_path, '').count(os.sep)

        indent = ' ' * 4 * level

        structure.append(f"{indent}{os.path.basename(root)}/")

        subindent = ' ' * 4 * (level + 1)

        for f in files:

            # ignore compiled / cache files
            if f.endswith((".pyc", ".log")):
                continue

            structure.append(f"{subindent}{f}")

    return structure


IMPORTANT_FILES = [
    "app.py",
    "event_manager.py",
    "predict.py",
    "live_violence_detection.py",
    "violence_detection_model.h5",
    "AlertFeed.jsx",
    "VideoFeedGrid.jsx",
    "events.db"
]


def check_important_files():

    found = []

    for root, dirs, files in os.walk(PROJECT_ROOT):

        dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]

        for file in files:

            if file in IMPORTANT_FILES:

                found.append(os.path.join(root, file))

    return found


print("Scanning project...\n")

tree = print_tree(PROJECT_ROOT)

important = check_important_files()

with open(REPORT_FILE, "w", encoding="utf-8") as f:

    f.write("========== PROJECT STRUCTURE ==========\n\n")

    for line in tree:
        f.write(line + "\n")

    f.write("\n\n========== IMPORTANT FILES FOUND ==========\n\n")

    for item in important:
        f.write(item + "\n")


print("✅ Scan complete")
print("Report saved to:", REPORT_FILE)