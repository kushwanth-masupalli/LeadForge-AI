import csv
import io
from typing import Optional

from models.lead import Lead


def leads_to_csv(leads: list[Lead]) -> bytes:
    """
    Serialize a list of Lead documents to CSV bytes.
    Weaknesses are joined with ' | ' so they fit in one cell.
    Social links are joined with ' | '.
    """
    fieldnames = [
        "name",
        "city",
        "niche",
        "website",
        "phone",
        "email",
        "address",
        "score",
        "weaknesses",
        "https",
        "mobile_friendly",
        "has_title",
        "has_meta_description",
        "has_h1",
        "has_og_tags",
        "social_links",
        "lighthouse_seo",
        "lighthouse_performance",
        "lighthouse_accessibility",
        "outreach_email",
        "outreach_dm",
        "outreach_pitch",
        "saved",
        "created_at",
    ]

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore", lineterminator="\n")
    writer.writeheader()

    for lead in leads:
        row = {
            "name": lead.name,
            "city": lead.city,
            "niche": lead.niche,
            "website": lead.website or "",
            "phone": lead.phone or "",
            "email": lead.email or "",
            "address": lead.address or "",
            "score": lead.score if lead.score is not None else "",
            "weaknesses": " | ".join(lead.weaknesses),
            "https": str(lead.https) if lead.https is not None else "",
            "mobile_friendly": str(lead.mobile_friendly) if lead.mobile_friendly is not None else "",
            "has_title": str(lead.has_title) if lead.has_title is not None else "",
            "has_meta_description": str(lead.has_meta_description) if lead.has_meta_description is not None else "",
            "has_h1": str(lead.has_h1) if lead.has_h1 is not None else "",
            "has_og_tags": str(lead.has_og_tags) if lead.has_og_tags is not None else "",
            "social_links": " | ".join(lead.social_links),
            "lighthouse_seo": lead.lighthouse_seo if lead.lighthouse_seo is not None else "",
            "lighthouse_performance": lead.lighthouse_performance if lead.lighthouse_performance is not None else "",
            "lighthouse_accessibility": lead.lighthouse_accessibility if lead.lighthouse_accessibility is not None else "",
            "outreach_email": lead.outreach_email or "",
            "outreach_dm": lead.outreach_dm or "",
            "outreach_pitch": lead.outreach_pitch or "",
            "saved": str(lead.saved),
            "created_at": lead.created_at.isoformat(),
        }
        writer.writerow(row)

    return output.getvalue().encode("utf-8")