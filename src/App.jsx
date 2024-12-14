import React, { useEffect, useState } from "react";
import DeliveryPlanner from "./components/DeliveryPlanner";
import PlaceholderMap from "./components/PlaceholderMap";
import { sendRequestToBackend } from "./api/simpleRequests";
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
    const [route, setRoute] = useState([]); // Store route coordinates

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

    const handleNodeClick = async (node) => {
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

            // Add to requests list
            setRequests([...requests, updatedRequest]);

            // Send to backend
            console.log("Sending request to backend with:", updatedRequest);

            try {
                const response = await sendRequestToBackend(updatedRequest);
                const parsedResponse = JSON.parse(response);
                if (response) {
                    const routeData = parsedResponse.map(([latitude, longitude]) => ({
                        lat: latitude,
                        lng: longitude,
                    }));
                    console.log("Received route data:", routeData);
                    setRoute(routeData); // Update the route state
                }
            } catch (error) {
                console.error("Error sending request to backend:", error);
            }

            // Reset for the next request
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
                    route={route} // Pass route to map
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
