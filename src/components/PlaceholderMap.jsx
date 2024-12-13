import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Create custom icons for the markers
const createIcon = (color) => {
	return new L.DivIcon({
		className: "custom-marker", // Add a custom class
		html: `<div style="
      background-color: ${color};
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    "></div>`, // Small circle as the marker
		iconSize: [10, 10], // Size of the circle
		iconAnchor: [5, 5], // Center the marker on its position
	});
};

const PlaceholderMap = ({ intersections = [], onNodeClick }) => {
  const center = [45.75465, 4.8674865]; // Center the map on Lyon
  // Check if intersections is an array and not empty
  if (intersections.length === 0) {
    return (
      <div className="map-placeholder" style={{ height: '100%', textAlign: 'center', paddingTop: '20px' }}>
        <p>Loading map data...</p>
      </div>
    );
  }

	return (
		<MapContainer
			center={center}
			zoom={16}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>

			{/* Render intersections as markers */}
			{Object.values(intersections).map((node) => (
				<Marker
					key={node.id}
					position={[node.latitude, node.longitude]}
					icon={createIcon("black")}
					eventHandlers={{
						click: () => onNodeClick(node),
					}}
				>
					<Popup>
						<strong>Node ID:</strong> {node.id}
						<br />
						<strong>Latitude:</strong> {node.latitude}
						<br />
						<strong>Longitude:</strong> {node.longitude}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default PlaceholderMap;
