import React, { useState, useEffect, useRef  } from "react";
import {
	FaWarehouse,
	FaTruckPickup,
	FaShippingFast,
	FaPlus,
	FaUser,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { generateDeliveryXML } from "../utils/utils";
import { importXMLFile } from "../api/Services";



const DeliveryPlanner = ({
	startNewTour,
	tours,
	setCurrentTour,
	selectionStep,
	setSelectionStep,
	finalizeTour,
	setRoute
}) => {

	const fileInputRef = useRef(null); // Référence pour l'input file

    // Fonction pour ouvrir la boîte de dialogue fichier
    const handleImportClick = () => {
        fileInputRef.current.click();
    };

	const [selectedCourier, setSelectedCourier] = useState(null);
	const couriers = [
		{ id: 1, name: "John Doe" },
		{ id: 2, name: "Jane Smith" },
		{ id: 3, name: "Mike Johnson" },
	];
	const handleTourClick = (tour) => {
		if (tour.route) {
			console.log("Tour clicked:", tour);
			setRoute(tour.route); 

		} else {
			console.warn("This tour does not have a route.");
		}
	};

	const exportToursToXML = () => {
        const xmlContent = generateDeliveryXML(tours);
        const blob = new Blob([xmlContent], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "export_tours.xml";
        link.click();
    };

	const getStepMessage = () => {
		if (selectionStep === "courier")
			return "Please select a courier for the new tour";
		if (selectionStep === "warehouse")
			return "Click on the map to select the warehouse for the new tour.";
		if (selectionStep === "pickup")
			return "Click on the map to select the pickup location for the new request.";
		if (selectionStep === "delivery")
			return "Click on the map to select the delivery location for the new request.";
		return "Press the button to start creating a new tour.";
	};

	const startNewTourWithCourier = () => {
		setSelectedCourier(null);
		setSelectionStep("courier");
		startNewTour();
	};

	const handleCourierSelect = (courier) => {
		setSelectedCourier(courier);
		setCurrentTour({ courier, requests: [] });
		setSelectionStep("warehouse");
	};

	const endTour = () => {
		finalizeTour();
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
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#f0f0f0",
					padding: "1rem",
					borderRadius: "0.75rem",
					marginBottom: "1rem",
					gap: "1rem",
				}}
			>
				<button
					onClick={selectionStep === null ? startNewTourWithCourier : null}
					style={{
						backgroundColor: "#336659",
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
					{selectionStep === null ? (
						<>
							<FaPlus /> New Tour
						</>
					) : (
						"Current Tour n°" + tours.length
					)}
				</button>

				{/* Bouton Import XML */}
				<button
					onClick={handleImportClick}
					style={{
						backgroundColor: "#2196F3",
						color: "white",
						padding: "0.5rem 1rem",
						fontSize: "1rem",
						border: "none",
						borderRadius: "0.5rem",
						cursor: "pointer",
					}}
				>
					Import XML
				</button>
				

				{/* Input File Caché */}
				<input
				type="file"
				accept=".xml"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={(e) => {
					const file = e.target.files[0];
					if (file) {
						const fileName = file.name; // Récupère le nom du fichier
						console.log("Selected file name:", fileName);

						// Envoie le nom du fichier au back-end
						importXMLFile(fileName)
							.then((response) => {
								console.log("File name sent successfully:", response);
							})
							.catch((error) => {
								console.error("Error sending file name:", error);
							});
					}
				}}
			/>


			

				{selectionStep == "pickup" && (
					<button
						onClick={endTour}
						style={{
							backgroundColor: "#800020",
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
						<RxCross2 />
						End tour
					</button>
				)}
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

			{/* Liste des tours */}
			<ul style={{ listStyleType: "none", padding: 0 }}>
				{tours.map((tour, indexTour) => (
					<li
						key={indexTour}
						onClick={() => handleTourClick(tour)}
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
							<strong>Tour n° : {indexTour + 1}</strong>
						</div>
						<div style={{ padding: "0.25rem" }}>
							<FaUser size={15} color="#9C27B0" title="Courier" />
							<strong>Courier:</strong> {tour.courier.name}
						</div>
						<div style={{ padding: "0.25rem" }}>
							<FaWarehouse size={15} color="#4CAF50" title="Warehouse" />
							<strong>Warehouse:</strong> ({tour.warehouse.latitude},{" "}
							{tour.warehouse.longitude})
						</div>

						{/* Liste des requêtes */}
						<ul
							style={{
								listStyleType: "none",
								paddingLeft: "1rem",
								marginTop: "0.5rem",
							}}
						>
							{tour.requests.map((req, indexReq) => (
								<li
									key={indexReq}
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
										<FaTruckPickup size={15} color="#FF9800" title="Pickup" />
										<strong>Pickup:</strong> ({req.pickup.latitude},{" "}
										{req.pickup.longitude})
									</div>
									<div style={{ padding: "0.25rem" }}>
										<FaShippingFast
											size={15}
											color="#2196F3"
											title="Delivery"
										/>
										<strong>Delivery:</strong> ({req.delivery.latitude},{" "}
										{req.delivery.longitude})
									</div>
								</li>
							))}
						</ul>
												<button
							onClick={() => {
								const xmlContent = generateDeliveryXML(tour);
								const blob = new Blob([xmlContent], { type: "application/xml" });
								const link = document.createElement("a");
								link.href = URL.createObjectURL(blob);
								link.download = `tour_${indexTour + 1}.xml`;
								link.click();
							}}
							style={{
								backgroundColor: "#4CAF50",
								color: "white",
								padding: "0.3rem 0.8rem",
								fontSize: "0.9rem",
								border: "none",
								borderRadius: "0.5rem",
								cursor: "pointer",
								marginTop: "0.5rem",
								display: "block",
        						margin: "1rem auto", // Centrage horizontal
							}}
						>
							Export this tour as an XML file
						</button>

					</li>
				))}
			</ul>
			
		</div>
	);
};

export default DeliveryPlanner;
