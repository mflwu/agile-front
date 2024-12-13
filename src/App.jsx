import React, { useEffect, useState } from "react";
import DeliveryPlanner from "./components/DeliveryPlanner";
import PlaceholderMap from "./components/PlaceholderMap";
import { sendRequestToBackend, fetchFastestPathData } from "./api/simpleRequests";
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

  const displayRoute = async () => {
    try {
        const routeData = await fetchFastestPathData();
        console.log("Route Data:", routeData);
        // Pass routeData to your map display logic to draw the route
    } catch (error) {
        console.error("Error displaying route:", error);
    }
};

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
      sendRequestToBackend(updatedRequest);
      displayRoute();
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
          route={[
            { latitude: 45.758083, longitude: 4.8675914 },
            { latitude: 45.757935, longitude: 4.8685865 },
            { latitude: 45.757706, longitude: 4.870082 },
          ]}
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
