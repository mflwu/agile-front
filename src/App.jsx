import React, { useEffect, useState } from "react";
import DeliveryPlanner from "./components/DeliveryPlanner";
import PlaceholderMap from "./components/PlaceholderMap";
import { sendRequestToBackend } from "./api/simpleRequests";
import "./styles/App.css";
import "leaflet/dist/leaflet.css";
import { setSourceContent } from "@jridgewell/gen-mapping";

function App() {
	const [tours, setTours] = useState([]);
	const [currentTour, setCurrentTour] = useState({
		courier: null,
		warehouse: null,
		requests: [],
	});
	const [selectionStep, setSelectionStep] = useState(null);
	const [intersections, setIntersections] = useState([]);

	useEffect(() => {
		const fetchIntersections = async () => {
			try {
				const response = await fetch("http://localhost:8080/city-map/loadmap");
				if (!response.ok) {
					throw new Error("Failed to load city map");
				}
				const data = await response.json();
				setIntersections(data.intersections || []); // Set intersections
			} catch (error) {
				console.error("Error fetching city map:", error);
				setIntersections([]); // Fallback to empty list
			}
		};

		fetchIntersections();
	}, []);

	const handleNodeClick = (node) => {
		if (!selectionStep) return;

		const updatedTour = { ...currentTour };

		if (selectionStep === "courier") {
			alert(
				"Select a courier before choosing a warehouse, pickup or delivery location."
			);
			return;
		} else if (selectionStep === "warehouse") {
			updatedTour.warehouse = node;
			setSelectionStep("pickup");
		} else if (selectionStep === "pickup") {
			updatedTour.requests.push({ pickup: node, delivery: null });
			setSelectionStep("delivery");
		} else if (selectionStep === "delivery") {
			// Assurez-vous qu'il y a au moins une requête pour ajouter la livraison
			if (updatedTour.requests.length === 0) {
				alert(
					"Please add a pickup request before selecting a delivery location."
				);
				return;
			}

			// Ajoute la livraison à la dernière requête
			updatedTour.requests[updatedTour.requests.length - 1].delivery = node;
			setSelectionStep("pickup");

			// Met à jour le tour actuel sans l'ajouter à `tours`
			setCurrentTour(updatedTour);
		}

		// Met à jour l'état du tour actuel
		setCurrentTour(updatedTour);
	};

	const startNewTour = () => {
		setSelectionStep("courier");
		setCurrentTour({
			courier: null,
			warehouse: null,
			requests: [],
		});
	};

	const finalizeTour = () => {
		if (
			currentTour.courier &&
			currentTour.warehouse &&
			currentTour.requests.length > 0 &&
			currentTour.requests.every((req) => req.pickup && req.delivery)
		) {
			setTours([...tours, currentTour]);
			setCurrentTour({
				courier: null,
				warehouse: null,
				requests: [],
			});
			setSelectionStep(null);
		} else {
			alert(
				"The tour is not complete. Make sure you have selected a courier, a warehouse, and at least one complete request."
			);
		}
	};

	return (
		<div className="App">
			<div className="map-section">
				<PlaceholderMap
					intersections={intersections}
					tours={tours}
					onNodeClick={handleNodeClick}
					selectionStep={selectionStep}
					currentTour={currentTour}
				/>
			</div>
			<div className="planner-section">
				<DeliveryPlanner
					startNewTour={startNewTour}
					tours={tours}
					setCurrentTour={setCurrentTour}
					selectionStep={selectionStep}
					setSelectionStep={setSelectionStep}
					finalizeTour={finalizeTour}
				/>
			</div>
		</div>
	);
}

export default App;
