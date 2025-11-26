// geocoding api
import {GEOCODING_KEY} from "@env";

export const getLatLngFromAddress = async (address) => {
    const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GEOCODING_KEY}`
    );

    if (!res.ok) {
        throw new Error(`Geocoding API Error: HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("No results found for this address");
    }

    const location = data.results[0].geometry.location;

    return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lng),
    };
};
