import React, { useState } from "react";
import {
	FaWarehouse,
	FaTruckPickup,
	FaShippingFast,
	FaPlus,
} from "react-icons/fa";

// Entrepôts prédéfinis
const warehouses = [
	{ id: 1, name: "Warehouse A", lat: 48.8566, lng: 2.3522 },
	{ id: 2, name: "Warehouse B", lat: 40.7128, lng: -74.006 },
];

// Livreurs prédéfinis
const deliverers = [
	{ id: 1, name: "John Doe" },
	{ id: 2, name: "Jane Smith" },
];

const DeliveryPlanner = ({ requests, setRequests }) => {
	const [selectionStep, setSelectionStep] = useState(null);
	const [newRequest, setNewRequest] = useState({
		warehouse: null,
		deliverer: null,
		pickup: null,
		deliveries: [],
	});

	const startNewRequest = () => {
		setNewRequest({
			warehouse: null,
			deliverer: null,
			pickup: null,
			deliveries: [],
		});
		setSelectionStep("warehouse");
	};

	const handleWarehouseSelection = (id) => {
		const warehouse = warehouses.find((wh) => wh.id === id);
		setNewRequest((prev) => ({ ...prev, warehouse }));
		setSelectionStep("deliverer");
	};

	const handleDelivererSelection = (id) => {
		const deliverer = deliverers.find((del) => del.id === id);
		setNewRequest((prev) => ({ ...prev, deliverer }));
		setSelectionStep("pickup");
	};

	const handlePickupSelection = (lat, lng) => {
		setNewRequest((prev) => ({ ...prev, pickup: { lat, lng } }));
		setSelectionStep("delivery");
	};

	const handleDeliverySelection = (lat, lng) => {
		setNewRequest((prev) => ({
			...prev,
			deliveries: [...prev.deliveries, { lat, lng }],
		}));
	};

	const completeRequest = () => {
		setRequests((prev) => [...prev, newRequest]);
		setSelectionStep(null);
	};

	const getStepMessage = () => {
		switch (selectionStep) {
			case "warehouse":
				return "Select a warehouse.";
			case "deliverer":
				return "Select a deliverer.";
			case "pickup":
				return "Click on the map to select the pickup location.";
			case "delivery":
				return "Click on the map to select delivery locations.";
			default:
				return "Press the button to start creating a new delivery.";
		}
	};

	return (
		<div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
			{/* Barre de navigation */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "1rem",
				}}
			>
				<FaWarehouse size={30} color="#4CAF50" />
				<FaTruckPickup size={30} color="#FF9800" />
				<FaShippingFast size={30} color="#2196F3" />
				<button
					onClick={startNewRequest}
					style={{
						backgroundColor: "#4CAF50",
						color: "white",
						padding: "0.5rem 1rem",
						borderRadius: "0.5rem",
					}}
				>
					<FaPlus /> New Request
				</button>
			</div>

			<p style={{ textAlign: "center", marginBottom: "1rem" }}>
				{getStepMessage()}
			</p>

			{/* Sélection du warehouse */}
			{selectionStep === "warehouse" && (
				<div>
					<h3>Select Warehouse</h3>
					{warehouses.map((wh) => (
						<button
							key={wh.id}
							onClick={() => handleWarehouseSelection(wh.id)}
							style={{ margin: "0.5rem" }}
						>
							{wh.name}
						</button>
					))}
				</div>
			)}

			{/* Sélection du livreur */}
			{selectionStep === "deliverer" && (
				<div>
					<h3>Select Deliverer</h3>
					{deliverers.map((del) => (
						<button
							key={del.id}
							onClick={() => handleDelivererSelection(del.id)}
							style={{ margin: "0.5rem" }}
						>
							{del.name}
						</button>
					))}
				</div>
			)}

			{/* Bouton pour finaliser la requête */}
			{selectionStep === "delivery" && (
				<div>
					<button
						onClick={completeRequest}
						style={{
							marginTop: "1rem",
							backgroundColor: "#2196F3",
							color: "white",
							padding: "0.5rem 1rem",
							borderRadius: "0.5rem",
						}}
					>
						Complete Request
					</button>
				</div>
			)}

			{/* Liste des requêtes */}
			<ul>
				{requests.map((req, index) => (
					<li
						key={index}
						style={{
							border: "1px solid #ccc",
							padding: "1rem",
							margin: "0.5rem 0",
						}}
					>
						<div>
							<strong>Warehouse:</strong> {req.warehouse.name}
						</div>
						<div>
							<strong>Deliverer:</strong> {req.deliverer.name}
						</div>
						<div>
							<strong>Pickup:</strong> ({req.pickup.lat}, {req.pickup.lng})
						</div>
						<div>
							<strong>Deliveries:</strong>
							<ul>
								{req.deliveries.map((delivery, i) => (
									<li key={i}>
										({delivery.lat}, {delivery.lng})
									</li>
								))}
							</ul>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default DeliveryPlanner;
