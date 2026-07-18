"""
fetch_kaggle_feed.py
---------------------
Runs inside GitHub Actions (never in the browser). Reads KAGGLE_USERNAME
and KAGGLE_KEY from environment variables that GitHub injects from the
repo's encrypted Secrets, calls the Kaggle API for the account's kernels
(notebooks), and writes the result to assets/kaggle-feed.json.

The site's client-side JS only ever reads that JSON file over HTTP — it
never sees the Kaggle credentials, because this script is the only thing
that uses them, and it runs on GitHub's servers, not the visitor's browser.
"""

import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

USERNAME = os.environ.get("KAGGLE_USERNAME", "").strip()
KEY = os.environ.get("KAGGLE_KEY", "").strip()
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "kaggle-feed.json")
PAGE_SIZE = 20

# Kaggle assigns a default title like "notebook501fd8c8d4" to a kernel
# whenever the author never renames it. These are almost always throwaway
# drafts/tests, not something to show off on a portfolio, so skip them.
GENERIC_TITLE_RE = re.compile(r"^notebook[0-9a-f]{8,}$", re.IGNORECASE)

if not USERNAME or not KEY:
    print("KAGGLE_USERNAME / KAGGLE_KEY are not set — check repo secrets.", file=sys.stderr)
    sys.exit(1)

auth_token = base64.b64encode(f"{USERNAME}:{KEY}".encode("utf-8")).decode("ascii")
url = (
    "https://www.kaggle.com/api/v1/kernels/list"
    f"?user={USERNAME}&sort_by=dateRun&page_size={PAGE_SIZE}"
)
request = urllib.request.Request(url, headers={"Authorization": f"Basic {auth_token}"})

try:
    with urllib.request.urlopen(request, timeout=30) as response:
        raw = response.read().decode("utf-8")
except urllib.error.HTTPError as err:
    print(f"Kaggle API returned HTTP {err.code}: {err.reason}", file=sys.stderr)
    sys.exit(1)
except urllib.error.URLError as err:
    print(f"Could not reach Kaggle API: {err.reason}", file=sys.stderr)
    sys.exit(1)

try:
    kernels = json.loads(raw)
except json.JSONDecodeError:
    print("Kaggle API did not return valid JSON.", file=sys.stderr)
    sys.exit(1)

if not isinstance(kernels, list):
    print(f"Unexpected Kaggle API response shape: {raw[:300]}", file=sys.stderr)
    sys.exit(1)

items = []
for kernel in kernels:
    ref = kernel.get("ref", "")
    if not ref:
        continue
    title = kernel.get("title", ref)
    if GENERIC_TITLE_RE.match(title.strip()):
        continue
    items.append(
        {
            "title": title,
            "ref": ref,
            "url": f"https://www.kaggle.com/code/{ref}",
            "lastRunTime": kernel.get("lastRunTime"),
            "totalVotes": kernel.get("totalVotes", 0),
            "language": kernel.get("language"),
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
