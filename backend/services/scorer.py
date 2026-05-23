from typing import Optional


def compute_score(analysis: dict) -> tuple[int, list[str]]:
    """
    Apply weighted scoring formula to analyzer output.

    Returns:
        score    -- int 0-100
        weaknesses -- list of human-readable failure strings
    """
    score = 0
    weaknesses: list[str] = []

    # --- No website at all ---
    if not analysis.get("loads") and not analysis.get("https"):
        weaknesses.append("No website found — missing from the web entirely")
        return 0, weaknesses

    # 1. Has a website (15 pts)
    if analysis.get("loads"):
        score += 15
    else:
        weaknesses.append("Website does not load — broken or unreachable")
        return score, weaknesses  # Everything else is moot

    # 2. HTTPS enabled (20 pts)
    if analysis.get("https"):
        score += 20
    else:
        weaknesses.append("No HTTPS — site runs on plain HTTP, harming trust and SEO")

    # 3. Mobile responsive (15 pts)
    if analysis.get("mobile_friendly") or analysis.get("has_viewport_meta"):
        score += 15
    else:
        weaknesses.append("Not mobile friendly — missing viewport meta tag, breaks on phones")

    # 4. SEO tags present (20 pts) — needs all three: title + meta desc + h1
    seo_issues = []
    if not analysis.get("has_title"):
        seo_issues.append("no page title")
    if not analysis.get("has_meta_description"):
        seo_issues.append("no meta description")
    if not analysis.get("has_h1"):
        seo_issues.append("no H1 heading")

    if not seo_issues:
        score += 20
    else:
        partial = 20 - (len(seo_issues) * 6)
        score += max(0, partial)
        weaknesses.append(f"Weak on-page SEO — {', '.join(seo_issues)}")

    # 5. Lighthouse SEO score (20 pts) — scaled proportionally
    lh_seo: Optional[float] = analysis.get("lighthouse_seo")
    if lh_seo is not None:
        lh_points = round(lh_seo * 0.2)
        score += lh_points
        if lh_seo < 70:
            weaknesses.append(f"Lighthouse SEO score only {int(lh_seo)}/100 — significant room to improve")
    # If Lighthouse not run, skip this category silently (no penalty)

    # 6. Social links present (10 pts)
    if analysis.get("social_links"):
        score += 10
    else:
        weaknesses.append("No social media links found on the site")

    # Bonus observations (no score change)
    if not analysis.get("has_og_tags"):
        weaknesses.append("No Open Graph tags — poor previews when shared on social media")

    response_ms = analysis.get("response_time_ms")
    if response_ms and response_ms > 3000:
        weaknesses.append(f"Slow server response — {response_ms}ms load time hurts SEO rankings")

    lh_perf = analysis.get("lighthouse_performance")
    if lh_perf is not None and lh_perf < 50:
        weaknesses.append(f"Lighthouse Performance score only {int(lh_perf)}/100 — poor user experience")

    return min(score, 100), weaknesses


def is_hot_lead(score: int) -> bool:
    """Returns True if the lead's digital presence is weak enough to be a strong prospect."""
    return score < 50