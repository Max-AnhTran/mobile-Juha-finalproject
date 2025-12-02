// amadeus api
import {AMADEUS_KEY} from "@env";

export const searchActivities = async (latitude, longitude) => {
    const url = `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=1`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer csbMeUF99PxYyNQ0lU0nUASKJAtr`,
            Accept: "application/json",
        },
    });
    
    if (!res.ok) {
        throw new Error(`Amadeus API Error: HTTP ${res.status} ${res.statusText}`);
    }
    
    console.log(url);
    const data = await res.json();
    return data.data;
};
