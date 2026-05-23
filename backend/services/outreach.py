from typing import Optional
import asyncio

import google.generativeai as genai

from config import settings


def build_prompt(
    name: str,
    website: Optional[str],
    score: int,
    weaknesses: list[str],
    niche: str,
    city: str,
) -> str:
    weakness_lines = "\n".join(f"- {w}" for w in weaknesses) if weaknesses else "- No specific issues detected"
    website_line = website or "No website found"

    return f"""
You are a friendly digital marketing consultant.

Business details:
Name: {name}
Type: {niche}
City: {city}
Website: {website_line}
Digital Presence Score: {score}/100
Issues:
{weakness_lines}

Generate personalized outreach for this business.

Return output exactly in this JSON format:

{{
  "outreach_email": "Subject: <short subject>\\n\\n<email body under 150 words>",
  "outreach_dm": "<LinkedIn DM under 80 words>",
  "outreach_pitch": "<2 sentence website/digital audit pitch>"
}}

Rules:
- Mention the business name.
- Mention at least one issue from the list.
- Keep it friendly.
- Do not be pushy.
- Do not use markdown.
- Return only JSON.
"""


def clean_json_text(text: str) -> str:
    text = text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "", 1).strip()

    if text.startswith("```"):
        text = text.replace("```", "", 1).strip()

    if text.endswith("```"):
        text = text[:-3].strip()

    return text


async def generate_outreach(
    name: str,
    website: Optional[str],
    score: int,
    weaknesses: list[str],
    niche: str,
    city: str,
) -> dict[str, str]:
    """
    Generates outreach copy directly using Gemini.
    Returns:
    {
        "outreach_email": "...",
        "outreach_dm": "...",
        "outreach_pitch": "..."
    }
    """

    if not settings.gemini_api_key:
        return {
            "outreach_email": "",
            "outreach_dm": "",
            "outreach_pitch": "",
        }

    prompt = build_prompt(
        name=name,
        website=website,
        score=score,
        weaknesses=weaknesses,
        niche=niche,
        city=city,
    )

    try:
        genai.configure(api_key=settings.gemini_api_key)

        model = genai.GenerativeModel("gemini-1.5-flash")

        response = await asyncio.to_thread(model.generate_content, prompt)

        raw_text = response.text or ""
        cleaned = clean_json_text(raw_text)

        import json

        parsed = json.loads(cleaned)

        return {
            "outreach_email": parsed.get("outreach_email", "").strip(),
            "outreach_dm": parsed.get("outreach_dm", "").strip(),
            "outreach_pitch": parsed.get("outreach_pitch", "").strip(),
        }

    except Exception as exc:
        print(f"Outreach generation failed for '{name}': {exc}")

        return {
            "outreach_email": "",
            "outreach_dm": "",
            "outreach_pitch": "",
        }