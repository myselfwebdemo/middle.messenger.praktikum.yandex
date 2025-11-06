// @ts-nocheck
import { clg } from '../main';
import { getLocByCoords } from './locationAPI';
import './map.css';

let map, marker, pin;

async function approxL() {
  try {
    const res = await fetch('http://ip-api.com/json/');
    const data = await res.json();

    getLocByCoords(data.lat, data.lon).then(userLoc => {
      document.getElementById('standalone').textContent = userLoc;
    })

    return { lat: data.lat, lon: data.lon };
  } catch (err) {
    console.error('Failed to get approximate location', err);
    return null;
  }
}

export async function MapInit() {
  const mapEl = document.getElementById('map');
  if (!mapEl) throw new Error('No map element found.');
  if (mapEl.children.length !== 0) return;
  
  const co = await approxL() || {lat:0, lon: 0}
  map = L.map('map').setView([co.lat, co.lon], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    maxNativeZoom: 17,
    updateWhenIdle: true,
    keepBuffer: 4,
    reuseTiles: true,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  pin = L.icon({
    iconUrl: '/assets/pin.png',
    iconSize: [30, 30],
    iconAnchor: [15, 35]
  });

  map.on('click', (e) => {
    const { lat,lng } = e.latlng;

    getLocByCoords(lat, lng).then(userLoc => {
      document.getElementById('standalone').textContent = userLoc;
    });
    // pinloc(lat,lng);
  });

  setTimeout(() => map.invalidateSize(), 0);
}

export function pinloc(lat: number, lon: number) {
  if (!map) throw new Error('Map is not initialized.')
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lon], { icon: pin }).addTo(map);
  map.setView([lat, lon]);
}
