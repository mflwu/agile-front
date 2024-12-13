import React, { useState } from "react";
import {
	FaWarehouse,
	FaTruckPickup,
	FaShippingFast,
	FaPlus,
	FaUser,
} from "react-icons/fa";

const DeliveryPlanner = ({
	requests,
	startNewRequest,
	setCurrentRequest,
	selectionStep,
	setSelectionStep,
}) => {
	const [selectedCourier, setSelectedCourier] = useState(null);
	const couriers = [
		{ id: 1, name: "John Doe" },
		{ id: 2, name: "Jane Smith" },
		{ id: 3, name: "Mike Johnson" },
	];

	const getStepMessage = () => {
		if (selectionStep === "courier") return "Please select a courier.";
		if (selectionStep === "warehouse")
			return "Click on the map to select the warehouse.";
		if (selectionStep === "pickup")
			return "Click on the map to select the pickup location.";
		if (selectionStep === "delivery")
			return "Click on the map to select the delivery location.";
		return "Press the button to start creating a new delivery.";
	};

	const startNewRequestWithCourier = () => {
		setSelectedCourier(null);
		setSelectionStep("courier");
		startNewRequest();
	};

	const handleCourierSelect = (courier) => {
		setSelectedCourier(courier);
		setCurrentRequest((prevRequest) => ({ ...prevRequest, courier }));
		setSelectionStep("warehouse");
	};

	return (
		<div
			style={{
				padding: "1rem",
				color: "#000000",
				maxWidth: "600px",
				margin: "0 auto",
			}}
		>
			{/* Barre de navigation avec icônes */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					backgroundColor: "#f0f0f0",
					padding: "1rem",
					borderRadius: "0.75rem",
					marginBottom: "1rem",
				}}
			>
				<FaUser size={30} color="#9C27B0" title="Courier" />
				<FaWarehouse size={30} color="#4CAF50" title="Warehouse" />
				<FaTruckPickup size={30} color="#FF9800" title="Pickup" />
				<FaShippingFast size={30} color="#2196F3" title="Delivery" />
				<button
					onClick={startNewRequestWithCourier}
					style={{
						backgroundColor: "#4CAF50",
						color: "white",
						padding: "0.5rem 1rem",
						fontSize: "1rem",
						border: "none",
						borderRadius: "0.5rem",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
					}}
				>
					<FaPlus />
					New Request
				</button>
			</div>

			{/* Message d'instruction */}
			<p
				style={{ textAlign: "center", fontSize: "1rem", marginBottom: "1rem" }}
			>
				{getStepMessage()}
			</p>

			{/* Sélection du livreur */}
			{selectionStep === "courier" && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "0.5rem",
						marginBottom: "1rem",
					}}
				>
					<h3>Select a Courier:</h3>
					{couriers.map((courier) => (
						<button
							key={courier.id}
							onClick={() => handleCourierSelect(courier)}
							style={{
								padding: "0.5rem 1rem",
								backgroundColor:
									selectedCourier?.id === courier.id ? "#4CAF50" : "#f0f0f0",
								color: selectedCourier?.id === courier.id ? "white" : "black",
								border: "1px solid #ccc",
								borderRadius: "0.5rem",
								cursor: "pointer",
							}}
						>
							{courier.name}
						</button>
					))}
				</div>
			)}

			{/* Liste des requêtes */}
			<ul style={{ listStyleType: "none", padding: 0 }}>
				{requests.map((req, index) => (
					<li
						key={index}
						style={{
							borderRadius: "0.75rem",
							border: "2px solid #000000",
							padding: "1rem",
							marginBottom: "0.5rem",
							backgroundColor: "#f9f9f9",
							fontSize: "0.9rem",
						}}
					>
						<div style={{ padding: "0.25rem" }}>
							<FaUser size={15} color="#9C27B0" title="Courier" />
							<strong>Courier:</strong> {req.courier.name}
						</div>
						<div style={{ padding: "0.25rem" }}>
							<FaWarehouse size={15} color="#4CAF50" title="Warehouse" />
							<strong>Warehouse:</strong> ({req.warehouse.latitude},{" "}
							{req.warehouse.longitude})
						</div>
						<div style={{ padding: "0.25rem" }}>
							<FaTruckPickup size={15} color="#FF9800" title="Pickup" />
							<strong>Pickup:</strong> ({req.pickup.latitude},{" "}
							{req.pickup.longitude})
						</div>
						<div style={{ padding: "0.25rem" }}>
							<FaShippingFast size={15} color="#2196F3" title="Delivery" />
							<strong>Delivery:</strong> ({req.delivery.latitude},{" "}
							{req.delivery.longitude})
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default DeliveryPlanner;
