import asyncio
import json
import shutil
import tempfile
from pathlib import Path
from typing import Optional


async def run_lighthouse(url: str) -> dict:
    """
    Run Google Lighthouse CLI against the given URL and return key scores.

    Requires: Node.js and `npm install -g lighthouse` on the host.
    Gracefully returns an empty dict if Node/Lighthouse is not found.
    """
    if not shutil.which("lighthouse"):
        raise RuntimeError("Lighthouse CLI not found — install with: npm install -g lighthouse")

    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = Path(tmpdir) / "report.json"

        cmd = [
            "lighthouse",
            url,
            "--output=json",
            f"--output-path={output_path}",
            "--chrome-flags=--headless --no-sandbox --disable-gpu",
            "--only-categories=performance,accessibility,seo",
            "--quiet",
        ]

        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await asyncio.wait_for(proc.communicate(), timeout=90)

        if proc.returncode != 0:
            raise RuntimeError(f"Lighthouse exited with code {proc.returncode}: {stderr.decode()[:200]}")

        if not output_path.exists():
            raise FileNotFoundError("Lighthouse did not produce an output file")

        with open(output_path) as f:
            report = json.load(f)

    categories = report.get("categories", {})

    def _score(category_key: str) -> Optional[float]:
        cat = categories.get(category_key)
        if cat and cat.get("score") is not None:
            return round(cat["score"] * 100, 1)
        return None

    return {
        "performance": _score("performance"),
        "accessibility": _score("accessibility"),
        "seo": _score("seo"),
    }