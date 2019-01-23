from googleplaces import GooglePlaces
import json, requests

API_KEY = "AIzaSyA8NlmEO3bpHrwHb_6p10lIywqcHKG6sVE"
PLACE_URL = "https://maps.googleapis.com/maps/api/place/details/json"
AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
RADIUS = 3200


def search_places(longitude, latitude, keyword):
    """
    search_places calls google place api

    keyword  -- A term to be matched against all available fields, including but
                not limited to name, type, and address (default None)
    location -- A human readable location, e.g 'London, England' (default None)

    name     -- A term to be matched against the names of the Places.
                Results will be restricted to those containing the passed name value. (default None)

    radius   -- The radius (in meters) around the location/lat_lng to restrict
                the search to. The maximum is 50000 meters (default 3200)

    types    -- An optional list of types, restricting the results to Places (default []).
                This kwarg has been deprecated in favour of the 'type' kwarg.
    """
    #'43.7797545,-79.4178318'--young and finch
    if (longitude == 0 or longitude == 'undefined') and (latitude == 0 or latitude == 'undefined') and 'in' not in keyword:
        AUTOCOMPLETE_PARAMS = {
            'rankby': 'distance',
            'key': API_KEY,
            'query': keyword + ' in Toronto',
         }
    else: 
        AUTOCOMPLETE_PARAMS = {
            'location': latitude + ',' + longitude,
            'rankby': 'distance',
            'key': API_KEY,
            'query': keyword,
         }
    autocomplete_req = requests.get(url = AUTOCOMPLETE_URL, params = AUTOCOMPLETE_PARAMS)
    data = autocomplete_req.json()
    place_res = []
    counter = 0
    for place in data['results']:
        ratingHolder = "No Rating"
        if 'rating' in place:
            ratingHolder = place['rating']
        place_dict = {
            'id': place['place_id'],
            'name': place['name'],
            'location': place['formatted_address'],
            'ratings': ratingHolder
        }
        place_res.append(place_dict)
        if counter == 5:
            break
        counter = counter + 1

    return json.dumps(place_res)


if __name__ == "__main__":
    print(search_places("TORONTO", "NOODLES"))
