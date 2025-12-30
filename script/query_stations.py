"""
Scripts to query OSM Overpass API for station data.
Note query data are usually not in any particular order, 
so sorting may be needed.
"""

import requests
import json

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# ==============================================================================
#                      Hard coded query functions
# ==============================================================================

def fetch_line6_stations():
    """
    This function is hard coded to only find "stations" nodes for Finch West LRT
    Different query is needed for the station stops and station platforms

    Since OSM station data don't seems to tage what line each station belongs to,
    we have to look for finch west LRT stations by either their start_date plus 
    Finch West station

    Returns:
        List of dicts with station name, lat, lon
    """
    query = """
    [out:json];
    area[name="Toronto"]->.searchArea;
    (
    node["railway"="station"]["network"="TTC"]["start_date"="2025-12-07"](area.searchArea);
    node["railway"="station"]["network"="TTC"]["name"="Finch West"](area.searchArea);
    );
    out body;
    >;
    out skel qt;
    """
    response = requests.post(OVERPASS_URL, data={'data': query})
    response.raise_for_status()
    data = response.json()

    stations = []

    for element in data["elements"]:
        if element["type"] == "node":
            name = element["tags"].get("name")
            lat = element.get("lat")
            lon = element.get("lon")

            stations.append({
                "name": name,
                "lat": lat,
                "lon": lon
            })

    return stations


# ==============================================================================
#                              Util functions
# ==============================================================================

def print_stations_in_js_list(stations):
    """
    Utility function to print stations in a format that can be copy-pasted
    into script.js file

    Args:
        stations: List of dicts with station name, lat, lon
    """
    for s in stations:
        print(f'            new Station("{s["name"]}", {s["lat"]}, {s["lon"]}),')


def sort_stations_west_to_east(stations):
    """
    Utility function to sort stations from west to east based on longitude

    Args:
        stations: List of dicts with station name, lat, lon
    """
    return sorted(stations, key=lambda x: x["lon"])


if __name__ == "__main__":
    stations = fetch_line6_stations()
    stations = sort_stations_west_to_east(stations)
    print("Line 6 Finch West LRT Stations:")
    print("--------------------------------")
    print_stations_in_js_list(stations)
