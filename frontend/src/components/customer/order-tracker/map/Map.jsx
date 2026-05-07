import "./map.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";

import { FaLocationCrosshairs } from "react-icons/fa6";
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
   Style per transport mode
----------------------------- */
const getLegStyle = (mode) => {
  switch (mode) {
    case "WALK":
      return { color: "#666", dashArray: "4 6", weight: 4 };

    case "BUS":
      return { color: "#007bff", weight: 5 };

    case "TRAM":
      return { color: "#28a745", weight: 5 };

    case "SUBWAY":
      return { color: "#dc3545", weight: 5 };

    default:
      return { color: "#000", weight: 4 };
  }
};

/* ----------------------------
   Locate Control
----------------------------- */
function LocateButton({ onLocate }) {
  const map = useMap();

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 16 });

    map.once("locationfound", (e) => {
      const coords = [e.latlng.lat, e.latlng.lng];
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
export default function Map({mode, restaurantCoords, userCoords, geometry, legs}) {
  const { t } = useTranslation();
  // Convert coords - leaflet format
  const orderPosition = restaurantCoords
    ? [restaurantCoords.lat, restaurantCoords.lon]
    : null;

  const [userPosition, setUserPosition] = useState(
    userCoords?.lat != null && userCoords?.lon != null
      ? [userCoords.lat, userCoords.lon]
      : null
  );

  // Prevent rendering before data is ready
  if (!orderPosition) return null;

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

        {/* Restaurant Marker */}
        <Marker position={orderPosition}>
          <Popup>{t("order_tracker.restaurant")}</Popup>
        </Marker>

        {/* User Marker */}
        {userPosition && (
          <Marker position={userPosition}>
            <Popup>{t("order_tracker.you_are_here")}</Popup>
          </Marker>
        )}

        <LocateButton onLocate={(coords) => setUserPosition(coords)} />

        {/* TRANSIT: render legs */}
        {mode === "transit" &&
          legs?.map((leg, index) => (
            <Polyline
              key={index}
              positions={leg.geometry}
              pathOptions={getLegStyle(leg.mode)}
            />
          ))}

        {/* NON-TRANSIT: render single geometry */}
        {mode !== "transit" && geometry && (
          <Polyline positions={geometry} pathOptions={{ color: "#007bff", weight: 5 }} />
        )}
      </MapContainer>
    </div>
  );
}
