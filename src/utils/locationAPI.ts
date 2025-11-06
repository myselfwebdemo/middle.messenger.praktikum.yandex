import { pinloc } from "./map";

export async function getLocByQuery(query: string) {
    const q = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=0`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data || data.length === 0) throw new Error('No result');

    const res = data[0];
    
    pinloc(res['lat'], res['lon']);
}
export async function getLocByCoords(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&limit=100&addressdetails=0`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data || data.length === 0) throw new Error('No result');

    pinloc(data['lat'], data['lon'])
    return data['display_name']
}
