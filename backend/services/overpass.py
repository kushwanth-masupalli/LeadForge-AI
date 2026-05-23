import httpx
from urllib.parse import urlencode
from typing import Optional
from config import settings

NICHE_TAG_MAP: dict[str, tuple[str, str]] = {
    "restaurant": ("amenity", "restaurant"),
    "restaurants": ("amenity", "restaurant"),
    "cafe": ("amenity", "cafe"),
    "cafes": ("amenity", "cafe"),
    "coffee": ("amenity", "cafe"),
    "bar": ("amenity", "bar"),
    "bars": ("amenity", "bar"),
    "pub": ("amenity", "pub"),
    "dentist": ("amenity", "dentist"),
    "dentists": ("amenity", "dentist"),
    "doctor": ("amenity", "doctors"),
    "doctors": ("amenity", "doctors"),
    "hospital": ("amenity", "hospital"),
    "pharmacy": ("amenity", "pharmacy"),
    "gym": ("leisure", "fitness_centre"),
    "gyms": ("leisure", "fitness_centre"),
    "hotel": ("tourism", "hotel"),
    "hotels": ("tourism", "hotel"),
    "real estate": ("office", "real_estate"),
    "real_estate": ("office", "real_estate"),
    "law": ("office", "lawyer"),
    "lawyer": ("office", "lawyer"),
    "lawyers": ("office", "lawyer"),
    "school": ("amenity", "school"),
    "salon": ("shop", "hairdresser"),
    "salons": ("shop", "hairdresser"),
    "spa": ("leisure", "spa"),
    "supermarket": ("shop", "supermarket"),
    "bakery": ("shop", "bakery"),
    "bookshop": ("shop", "books"),
    "clothing": ("shop", "clothes"),
    "web design": ("office", "it"),
    "it": ("office", "it"),
}

CITY_COORDS: dict[str, tuple[float, float]] = {
    "hyderabad": (17.3850, 78.4867),
    "mumbai": (19.0760, 72.8777),
    "bangalore": (12.9716, 77.5946),
    "bengaluru": (12.9716, 77.5946),
    "delhi": (28.7041, 77.1025),
    "new delhi": (28.6139, 77.2090),
    "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639),
    "pune": (18.5204, 73.8567),
    "ahmedabad": (23.0225, 72.5714),
    "jaipur": (26.9124, 75.7873),
    "surat": (21.1702, 72.8311),
    "lucknow": (26.8467, 80.9462),
    "kanpur": (26.4499, 80.3319),
    "nagpur": (21.1458, 79.0882),
    "visakhapatnam": (17.6868, 83.2185),
    "bhopal": (23.2599, 77.4126),
    "patna": (25.5941, 85.1376),
    "vadodara": (22.3072, 73.1812),
    "coimbatore": (11.0168, 76.9558),
    "london": (51.5074, -0.1278),
    "new york": (40.7128, -74.0060),
    "dubai": (25.2048, 55.2708),
    "singapore": (1.3521, 103.8198),
}

# Mirrors in priority order — kumi first since overpass-api.de blocks India IPs
OVERPASS_MIRRORS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",  # fallback only
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
}


def parse_query(query: str) -> tuple[str, str]:
    query_lower = query.lower().strip()
    if " in " in query_lower:
        parts = query_lower.split(" in ", 1)
        return parts[0].strip(), parts[1].strip().title()
    for city_name in CITY_COORDS:
        if city_name in query_lower:
            niche = query_lower.replace(city_name, "").strip().rstrip(",")
            return niche, city_name.title()
    return query_lower, "Unknown"


def get_osm_tag(niche: str) -> tuple[str, str]:
    return NICHE_TAG_MAP.get(niche.lower().strip(), ("amenity", "restaurant"))


def get_city_coords(city: str) -> Optional[tuple[float, float]]:
    return CITY_COORDS.get(city.lower().strip())


def build_overpass_query(tag_key: str, tag_value: str, lat: float, lon: float, radius: int, limit: int) -> str:
    """
    Lightweight query — node only (no way/relation) with an explicit result cap.
    This avoids 504 timeouts on busy mirrors.
    """
    return (
        f"[out:json][timeout:25][maxsize:536870912];"
        f"node[\"{tag_key}\"=\"{tag_value}\"](around:{radius},{lat},{lon});"
        f"out {limit} tags;"
    )


def parse_element(element: dict, niche: str, city: str) -> Optional[dict]:
    tags = element.get("tags", {})
    name = tags.get("name") or tags.get("name:en")
    if not name:
        return None

    lat = element.get("lat")
    lon = element.get("lon")

    website = tags.get("website") or tags.get("url") or tags.get("contact:website")
    if website:
        website = website.strip().rstrip("/")
        if not website.startswith("http"):
            website = "https://" + website

    phone = tags.get("phone") or tags.get("contact:phone")

    address_parts = [
        tags.get("addr:housenumber"),
        tags.get("addr:street"),
        tags.get("addr:suburb"),
        tags.get("addr:city") or city,
    ]
    address = ", ".join(p for p in address_parts if p)

    return {
        "name": name,
        "city": city,
        "niche": niche,
        "lat": lat,
        "lon": lon,
        "phone": phone,
        "website": website,
        "address": address or city,
    }


async def _post_query(query: str, mirror_url: str, timeout: int = 30) -> Optional[list]:
    body = urlencode({"data": query}).encode("utf-8")
    try:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True, headers=HEADERS) as client:
            response = await client.post(mirror_url, content=body)
            print(f"  HTTP {response.status_code} from {mirror_url}")
            response.raise_for_status()
            elements = response.json().get("elements", [])
            print(f"  ✅ Got {len(elements)} elements")
            return elements
    except Exception as exc:
        print(f"  ⚠️  {mirror_url} failed: {exc}")
        return None


async def discover_businesses(niche: str, city: str, limit: int) -> list[dict]:
    coords = get_city_coords(city)
    if not coords:
        print(f"⚠️  Unknown city '{city}'")
        return []

    lat, lon = coords
    tag_key, tag_value = get_osm_tag(niche)

    # Fetch a larger pool so we can filter for ones with websites
    # Cap the OSM fetch at 200 nodes max to keep queries fast
    fetch_limit = min(limit * 8, 200)
    radius = 10000  # start with 10km

    print(f"🔍 Searching OSM: [{tag_key}={tag_value}] within {radius}m of {city} (fetch up to {fetch_limit})")

    query = build_overpass_query(tag_key, tag_value, lat, lon, radius, fetch_limit)

    elements = None
    for mirror in OVERPASS_MIRRORS:
        elements = await _post_query(query, mirror)
        if elements is not None:
            break

    # If still nothing, retry with 20km
    if elements is not None and len(elements) == 0:
        print(f"  ↩️  0 results at 10km — retrying at 20km")
        query2 = build_overpass_query(tag_key, tag_value, lat, lon, 20000, fetch_limit)
        for mirror in OVERPASS_MIRRORS:
            elements = await _post_query(query2, mirror)
            if elements is not None:
                break

    if not elements:
        print("❌ All mirrors failed or returned nothing")
        return []

    businesses: list[dict] = []
    seen: set[str] = set()
    for el in elements:
        parsed = parse_element(el, niche, city)
        if parsed and parsed["name"] not in seen:
            seen.add(parsed["name"])
            businesses.append(parsed)

    # Sort: websites first
    businesses.sort(key=lambda b: 0 if b.get("website") else 1)

    with_site = sum(1 for b in businesses if b.get("website"))
    print(f"✅ {len(businesses)} businesses found — {with_site} have websites")

    return businesses