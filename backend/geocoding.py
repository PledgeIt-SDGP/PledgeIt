import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

def get_coordinates(address: str):
    """
    Converts an address into latitude and longitude using OpenStreetMap's Nominatim API.
    """
    params = {"q": address, "format": "json"}
    headers = {"User-Agent": "PledgeIt-GeoLookup/1.0"}  # Prevent API blocking
    try:
        response = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data and len(data) > 0:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except requests.exceptions.RequestException as e:
        print(f"Geocoding Error: {e}")
    return None, None
