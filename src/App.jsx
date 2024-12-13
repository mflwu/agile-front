import React, { useEffect, useState } from "react";
import DeliveryPlanner from "./components/DeliveryPlanner";
import PlaceholderMap from "./components/PlaceholderMap";
import { sendRequestToBackend } from "./api/simpleRequests";
import "./styles/App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [requests, setRequests] = useState([]);
  const [currentRequest, setCurrentRequest] = useState({
    warehouse: null,
    pickup: null,
    delivery: null,
    courier: null,
  });
  const [selectionStep, setSelectionStep] = useState(null); // 'warehouse', 'pickup', 'delivery'
  const [intersections, setIntersections] = useState([]); // Store intersections directly
  const [highlightedNodes, setHighlightedNodes] = useState({
    warehouse: null,
    pickup: null,
    delivery: null,
  });

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
      setHighlightedNodes({ ...highlightedNodes, warehouse: node.id });
    } else if (selectionStep === "pickup") {
      updatedRequest.pickup = node;
      setSelectionStep("delivery");
      setHighlightedNodes({ ...highlightedNodes, pickup: node.id });
    } else if (selectionStep === "delivery") {
      updatedRequest.delivery = node;
      setRequests([...requests, updatedRequest]);
      console.log("New request:", updatedRequest);

      // Send the request to the backend
      sendRequestToBackend(updatedRequest)
        .then((response) => console.log("Backend response:", response))
        .catch((error) =>
          console.error("Failed to send request to backend:", error)
        );

      setSelectionStep(null);
      setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
      setHighlightedNodes({ warehouse: null, pickup: null, delivery: null });
    }

    setCurrentRequest(updatedRequest);
  };

  const startNewRequest = () => {
    setSelectionStep("warehouse");
    setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
    setHighlightedNodes({ warehouse: null, pickup: null, delivery: null });
  };

  return (
    <div className="App">
      <div className="map-section">
        <PlaceholderMap
          intersections={intersections} // Pass intersections directly
          onNodeClick={handleNodeClick}
          highlightedNodes={highlightedNodes} // Pass highlighted nodes
        />
      </div>
      <div className="planner-section">
        <DeliveryPlanner
          requests={requests}
          startNewRequest={startNewRequest}
          selectionStep={selectionStep}
          setSelectionStep={setSelectionStep}
        />
      </div>
    </div>
  );
}

export default App;
