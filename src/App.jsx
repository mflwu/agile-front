import React, { useEffect, useState } from "react";
import DeliveryPlanner from "./components/DeliveryPlanner";
import PlaceholderMap from "./components/PlaceholderMap";
import "./styles/App.css";
import "leaflet/dist/leaflet.css";

function App() {
	const [requests, setRequests] = useState([]);
	const [currentRequest, setCurrentRequest] = useState({
		courier: null,
		warehouse: null,
		pickup: null,
		delivery: null,
	});
	const [selectionStep, setSelectionStep] = useState(null);
	const [intersections, setIntersections] = useState([]); // Store intersections directly

	// Fetch intersections from backend
	useEffect(() => {
		fetch("http://localhost:8080/city-map/loadmap")
			.then((response) => {
				if (!response.ok) throw new Error("Failed to load city map");
				return response.json();
			})
			.then((data) => {
				setIntersections(data.intersections || []); // Set intersections
			})
			.catch((error) => {
				console.error("Error fetching city map:", error);
				setIntersections([]); // Fallback to empty list
			});
	}, []);

	const handleNodeClick = (node) => {
		if (!selectionStep) return;

		const updatedRequest = { ...currentRequest };

		if (selectionStep === "warehouse") {
			updatedRequest.warehouse = node;
			setSelectionStep("pickup");
		} else if (selectionStep === "pickup") {
			updatedRequest.pickup = node;
			setSelectionStep("delivery");
		} else if (selectionStep === "delivery") {
			updatedRequest.delivery = node;

			// Add the new request to the list of requests
			setRequests([...requests, updatedRequest]);

			// Reset the selection step, the current request and the highlighted nodes to prepare for the next request
			setSelectionStep(null);
			setCurrentRequest({
				courier: null,
				warehouse: null,
				pickup: null,
				delivery: null,
			});
		}

		setCurrentRequest(updatedRequest);
	};

	const startNewRequest = () => {
		setSelectionStep("courier");
		setCurrentRequest({
			courier: null,
			warehouse: null,
			pickup: null,
			delivery: null,
		});
	};

	return (
		<div className="App">
			<div className="map-section">
				<PlaceholderMap
					intersections={intersections}
					requests={requests}
					onNodeClick={handleNodeClick}
				/>
			</div>
			<div className="planner-section">
				<DeliveryPlanner
					startNewRequest={startNewRequest}
					setCurrentRequest={setCurrentRequest}
					requests={requests}
					selectionStep={selectionStep}
					setSelectionStep={setSelectionStep}
				/>
			</div>
		</div>
	);
}

export default App;
