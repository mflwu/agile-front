import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Tableau de couleurs partagé
const colors = ["red", "blue", "green", "purple", "orange"];

// Fonction pour créer des icônes personnalisés avec forme, couleur et label
const createIcon = (shape, color, size = 15, label = null) => {
	const labelHTML = label
		? `<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: ${
				size / 2
		  }px; color: white;">${label}</span>`
		: "";
	return new L.DivIcon({
		className: "custom-marker",
		html: `<div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            clip-path: ${shape};
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${labelHTML}
        </div>`,
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
	tours,
	selectionStep,
	currentTour,
	route,
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
			{/* Afficher les intersections comme marqueurs gris */}
			{Object.values(intersections).map((node) => (
				<Marker
					key={node.id}
					position={[node.latitude, node.longitude]}
					icon={createIcon(shapes.circle, "grey")}
					eventHandlers={{
						click: () => onNodeClick(node),
					}}
				>
					{selectionStep === null && (
						<Popup>
							<strong>Node ID:</strong> {node.id}
							<br />
							<strong>Latitude:</strong> {node.latitude}
							<br />
							<strong>Longitude:</strong> {node.longitude}
						</Popup>
					)}
				</Marker>
			))}
			{/* Afficher les requêtes avec des couleurs et des formes différentes */}
			{tours.map((tour, indexTour) => {
				const color = colors[indexTour % colors.length];

				return (
					<React.Fragment key={indexTour}>
						{/* Warehouse - Carré */}
						{tour.warehouse && (
							<Marker
								position={[tour.warehouse.latitude, tour.warehouse.longitude]}
								icon={createIcon(shapes.square, color, 20, `W${indexTour + 1}`)}
							>
								<Popup>Tour n°{indexTour + 1} - Warehouse</Popup>
							</Marker>
						)}

						{tour.requests.map((request, indexRequest) => {
							const requestNumber = indexRequest + 1;
							return (
								<React.Fragment key={`tour-${indexTour}-req-${indexRequest}`}>
									{request.pickup && (
										<Marker
											position={[
												request.pickup.latitude,
												request.pickup.longitude,
											]}
											icon={createIcon(
												shapes.triangle,
												color,
												20,
												`${requestNumber}`
											)}
										>
											<Popup>
												Tour n°{indexTour + 1} - Requête n°{requestNumber}{" "}
												Pickup
											</Popup>
										</Marker>
									)}
									{request.delivery && (
										<Marker
											position={[
												request.delivery.latitude,
												request.delivery.longitude,
											]}
											icon={createIcon(
												shapes.circle,
												color,
												20,
												`${requestNumber}`
											)}
										>
											<Popup>
												Tour n°{indexTour + 1} - Requête n°{requestNumber}{" "}
												Delivery
											</Popup>
										</Marker>
									)}
								</React.Fragment>
							);
						})}
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

			{/* Afficher le tour actuel en cours de création */}
			{currentTour && (
				<React.Fragment>
					{/* Déterminer la couleur pour currentTour */}
					{(() => {
						const currentColor = colors[tours.length % colors.length];
						return (
							<React.Fragment>
								{/* Warehouse */}
								{currentTour.warehouse && (
									<Marker
										position={[
											currentTour.warehouse.latitude,
											currentTour.warehouse.longitude,
										]}
										icon={createIcon(shapes.square, currentColor, 20, `W`)}
									>
										<Popup>Tour Actuel - Warehouse</Popup>
									</Marker>
								)}
								{/* Requests */}
								{currentTour.requests.map((request, indexRequest) => (
									<React.Fragment key={`current-req-${indexRequest}`}>
										{request.pickup && (
											<Marker
												position={[
													request.pickup.latitude,
													request.pickup.longitude,
												]}
												icon={createIcon(
													shapes.triangle,
													currentColor,
													20,
													`${indexRequest + 1}`
												)}
											>
												<Popup>
													Tour Actuel - Requête n°{indexRequest + 1} Pickup
												</Popup>
											</Marker>
										)}
										{request.delivery && (
											<Marker
												position={[
													request.delivery.latitude,
													request.delivery.longitude,
												]}
												icon={createIcon(
													shapes.circle,
													currentColor,
													20,
													`${indexRequest + 1}`
												)}
											>
												<Popup>
													Tour Actuel - Requête n°{indexRequest + 1} Delivery
												</Popup>
											</Marker>
										)}
									</React.Fragment>
								))}
							</React.Fragment>
						);
					})()}
				</React.Fragment>
			)}
		</MapContainer>
	);
};

export default PlaceholderMap;
