import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Fonction pour créer des icônes personnalisés avec forme et couleur
const createIcon = (shape, color, size = 15) => {
	return new L.DivIcon({
		className: "custom-marker",
		html: `<div style="
			width: ${size}px;
			height: ${size}px;
			background-color: ${color};
			clip-path: ${shape};
			box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
		"></div>`,
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2],
	});
};

// Formes SVG pour les marqueurs
const shapes = {
	square: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
	triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
	circle: "circle(50% at 50% 50%)",
};

const PlaceholderMap = ({
	intersections = [],
	onNodeClick,
	highlightedNodes,
	requests,
	route = [], // New prop to handle the route
}) => {
	const center = [45.75465, 4.8674865]; // Centre de la carte

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

			{/* Afficher les intersections comme marqueurs noirs */}
			{Object.values(intersections).map((node) => (
				<Marker
					key={node.id}
					position={[node.latitude, node.longitude]}
					icon={createIcon(shapes.circle, "black")}
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

			{/* Afficher les requêtes avec des couleurs et des formes différentes */}
			{requests.map((request, index) => {
				// Générer une couleur unique pour chaque requête
				const colors = ["red", "blue", "green", "purple", "orange"];
				const color = colors[index % colors.length];

				return (
					<React.Fragment key={index}>
						{/* Warehouse - Carré */}
						{request.warehouse && (
							<Marker
								position={[
									request.warehouse.latitude,
									request.warehouse.longitude,
								]}
								icon={createIcon(shapes.square, color)}
							>
								<Popup>Warehouse - {request.warehouse.id}</Popup>
							</Marker>
						)}

						{/* Pickup - Triangle */}
						{request.pickup && (
							<Marker
								position={[request.pickup.latitude, request.pickup.longitude]}
								icon={createIcon(shapes.triangle, color, 25)}
							>
								<Popup>Pickup - {request.pickup.id}</Popup>
							</Marker>
						)}

						{/* Delivery - Rond */}
						{request.delivery && (
							<Marker
								position={[
									request.delivery.latitude,
									request.delivery.longitude,
								]}
								icon={createIcon(shapes.circle, color)}
							>
								<Popup>Delivery - {request.delivery.id}</Popup>
							</Marker>
						)}
					</React.Fragment>
				);
			})}

			{/* Display route as a Polyline */}
			{route.length > 1 && (
				<Polyline
					positions={route.map((point) => [point.lat, point.lng])} // Extract lat and lng
					color="blue" // Set the color of the route
					weight={4} // Thickness of the line
				/>
			)}
		</MapContainer>
	);
};

export default PlaceholderMap;