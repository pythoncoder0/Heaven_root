import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useRef } from "react";

function LocationMarker({ position, setLatLng }) {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ setLatitude, setLongitude }) {
  const [position, setPosition] = useState(null);
  const [search, setSearch] = useState("");
  const mapRef = useRef();

  const setLatLng = ({ lat, lng }) => {
    setPosition({ lat, lng });
    setLatitude && setLatitude(String(lat));
    setLongitude && setLongitude(String(lng));
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatLng({ lat: latitude, lng: longitude });
        },
        () => {
          alert("Could not get your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // --- THIS IS IMPORTANT ---
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevents page reload!
    if (!search) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setLatLng({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      alert("Location not found.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: 10, display: "flex", gap: 8 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search location..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#008080",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        <button
          type="button"
          style={{
            padding: "8px 16px",
            background: "#008080",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleLocateMe}
        >
          Locate Me
        </button>
      </form>
      <MapContainer
        center={position ? [position.lat, position.lng] : [32.219042, 76.323404]}
        zoom={position ? 13 : 12}
        style={{ height: 600, width: "100%" }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={position} setLatLng={setLatLng} />
      </MapContainer>
    </div>
  );
}