import time
import re
import httpx
from bs4 import BeautifulSoup
from typing import Optional

from config import settings

SOCIAL_DOMAINS = [
    "instagram.com",
    "facebook.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "youtube.com",
    "tiktok.com",
    "pinterest.com",
]

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")


def _extract_social_links(soup: BeautifulSoup) -> list[str]:
    found = []
    for a in soup.find_all("a", href=True):
        href: str = a["href"]
        if any(domain in href for domain in SOCIAL_DOMAINS):
            found.append(href)
    return list(dict.fromkeys(found))  # deduplicate, preserve order


def _extract_email(soup: BeautifulSoup, html: str) -> Optional[str]:
    # Check mailto links first
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("mailto:"):
            return href[7:].split("?")[0].strip()
    # Regex scan the raw HTML
    match = EMAIL_REGEX.search(html)
    return match.group(0) if match else None


async def analyze_website(url: str) -> dict:
    """
    Run a full analysis of the given URL.
    Returns a structured dict with all checks.
    """
    result: dict = {
        "loads": False,
        "https": url.startswith("https://") if url else False,
        "response_time_ms": None,
        "has_title": False,
        "has_meta_description": False,
        "has_h1": False,
        "has_og_tags": False,
        "has_viewport_meta": False,
        "mobile_friendly": False,
        "email": None,
        "social_links": [],
        "lighthouse_seo": None,
        "lighthouse_performance": None,
        "lighthouse_accessibility": None,
    }

    if not url:
        return result

    # Normalize URL
    if not url.startswith("http"):
        url = "https://" + url

    # --- Basic HTTP check ---
    start = time.monotonic()
    try:
        async with httpx.AsyncClient(
            timeout=settings.request_timeout_s,
            follow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0 (LeadForge Analyzer)"},
        ) as client:
            response = await client.get(url)
            elapsed_ms = int((time.monotonic() - start) * 1000)
            response.raise_for_status()
    except Exception as exc:
        print(f"⚠️  Failed to load {url}: {exc}")
        result["loads"] = False
        return result

    result["loads"] = True
    result["response_time_ms"] = elapsed_ms

    # Re-check HTTPS after redirects (the final URL may have changed)
    result["https"] = str(response.url).startswith("https://")

    html = response.text

    # --- HTML Parsing ---
    soup = BeautifulSoup(html, "html.parser")

    result["has_title"] = bool(soup.find("title") and soup.find("title").get_text(strip=True))

    meta_desc = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    result["has_meta_description"] = bool(meta_desc and meta_desc.get("content", "").strip())

    result["has_h1"] = bool(soup.find("h1"))

    og_title = soup.find("meta", property="og:title")
    og_image = soup.find("meta", property="og:image")
    result["has_og_tags"] = bool(og_title or og_image)

    viewport = soup.find("meta", attrs={"name": re.compile(r"^viewport$", re.I)})
    result["has_viewport_meta"] = bool(viewport)
    result["mobile_friendly"] = bool(viewport)

    result["social_links"] = _extract_social_links(soup)
    result["email"] = _extract_email(soup, html)

    # --- Optional Playwright deep scan ---
    if settings.enable_playwright:
        try:
            playwright_data = await _playwright_check(url)
            result["mobile_friendly"] = playwright_data.get("mobile_friendly", result["mobile_friendly"])
        except Exception as exc:
            print(f"ℹ️  Playwright scan skipped: {exc}")

    # --- Optional Lighthouse ---
    if settings.enable_lighthouse:
        try:
            from services.lighthouse import run_lighthouse
            lh = await run_lighthouse(url)
            result["lighthouse_seo"] = lh.get("seo")
            result["lighthouse_performance"] = lh.get("performance")
            result["lighthouse_accessibility"] = lh.get("accessibility")
        except Exception as exc:
            print(f"ℹ️  Lighthouse scan skipped: {exc}")

    return result


async def _playwright_check(url: str) -> dict:
    """Render page at 375px width and check for layout issues."""
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 375, "height": 812})
        page = await context.new_page()
        await page.goto(url, timeout=15000)
        # Check if horizontal scroll exists (layout broken on mobile)
        scroll_width = await page.evaluate("document.documentElement.scrollWidth")
        viewport_width = await page.evaluate("window.innerWidth")
        await browser.close()

    return {"mobile_friendly": scroll_width <= viewport_width + 5}