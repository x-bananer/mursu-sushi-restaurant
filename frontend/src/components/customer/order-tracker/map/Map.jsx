import "./map.css";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ----------------------------
   Locate Control
----------------------------- */
function LocateButton({ onLocate }) {
  const map = useMap();

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 16 });

    map.once("locationfound", (e) => {
      const coords = e.latlng;
      map.flyTo(coords, 16);
      onLocate(coords);
    });
  };

  return (
    <div className="map__locate-btn leaflet-control leaflet-bar" onClick={handleClick}>
      <FaLocationCrosshairs />
    </div>
  );
}

/* ----------------------------
   Map
----------------------------- */
export default function Map() {
  const orderPosition = [59.437, 24.7536];

  const [userPosition, setUserPosition] = useState(null);

  return (
    <div className="order__map">
      <MapContainer
        center={orderPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ORDER LOCATION */}
        <Marker position={orderPosition}>
          <Popup>Order location</Popup>
        </Marker>

        {/* USER LOCATION (ONLY AFTER CLICK) */}
        {userPosition && (
          <Marker position={userPosition}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        <LocateButton onLocate={setUserPosition} />
      </MapContainer>
    </div>
  );
}
