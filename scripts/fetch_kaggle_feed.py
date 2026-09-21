"""
fetch_kaggle_feed.py
---------------------
Runs inside GitHub Actions (never in the browser). Reads KAGGLE_API_TOKEN
from an environment variable that GitHub injects from the repository's
encrypted Secrets, calls the official Kaggle client for the account's kernels
(notebooks), and writes the result to assets/kaggle-feed.json.

The site's client-side JS only ever reads that JSON file over HTTP — it
never sees the Kaggle credentials, because this script is the only thing
that uses them, and it runs on GitHub's servers, not the visitor's browser.
"""

import json
import os
import re
import sys
from datetime import datetime, timezone

USERNAME = "gizemglc"
TOKEN = os.environ.get("KAGGLE_API_TOKEN", "").strip()
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "kaggle-feed.json")
PAGE_SIZE = 20

# Kaggle assigns a default title like "notebook501fd8c8d4" to a kernel
# whenever the author never renames it. These are almost always throwaway
# drafts/tests, not something to show off on a portfolio, so skip them.
GENERIC_TITLE_RE = re.compile(r"^notebook[0-9a-f]{8,}$", re.IGNORECASE)

if not TOKEN:
    print("KAGGLE_API_TOKEN is not set — check repository Actions secrets.", file=sys.stderr)
    sys.exit(1)

try:
    # Importing the official client performs authentication using
    # KAGGLE_API_TOKEN without exposing the token to logs or generated files.
    import kaggle

    kernels = kaggle.api.kernels_list(
        user=USERNAME,
        sort_by="dateRun",
        page_size=PAGE_SIZE,
    ) or []
except Exception as err:
    print(f"Kaggle API request failed: {type(err).__name__}", file=sys.stderr)
    sys.exit(1)

items = []
for kernel in kernels:
    ref = kernel.ref
    if not ref:
        continue
    title = kernel.title or ref
    if GENERIC_TITLE_RE.match(title.strip()):
        continue
    last_run_time = kernel.last_run_time
    items.append(
        {
            "title": title,
            "ref": ref,
            "url": f"https://www.kaggle.com/code/{ref}",
            "lastRunTime": last_run_time.isoformat() if last_run_time else None,
            "totalVotes": kernel.total_votes,
            "language": kernel.language or None,
        }
    )

payload = {
    "updatedAt": datetime.now(timezone.utc).isoformat(),
    "items": items,
}

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"Wrote {len(items)} kernels to {OUTPUT_PATH}")
