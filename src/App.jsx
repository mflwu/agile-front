import React, { useEffect, useState } from 'react';
import DeliveryPlanner from './components/DeliveryPlanner';
import PlaceholderMap from './components/PlaceholderMap';
import './styles/App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const [requests, setRequests] = useState([]);
  const [currentRequest, setCurrentRequest] = useState({
    warehouse: null,
    pickup: null,
    delivery: null,
  });
  const [selectionStep, setSelectionStep] = useState(null); // 'warehouse', 'pickup', 'delivery'
  const [intersections, setIntersections] = useState([]); // Store intersections directly

  // Fetch intersections from backend
  useEffect(() => {
    fetch('http://localhost:8080/city-map/loadmap')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load city map');
        return response.json();
      })
      .then((data) => {
        // Set intersections from response
        setIntersections(data.intersections || []);
      })
      .catch((error) => {
        console.error('Error fetching city map:', error);
        setIntersections([]); // Fallback to empty list
      });
  }, []);

  const handleNodeClick = (node) => {
    if (!selectionStep) return;

    const updatedRequest = { ...currentRequest };

    if (selectionStep === 'warehouse') {
      updatedRequest.warehouse = node;
      setSelectionStep('pickup');
    } else if (selectionStep === 'pickup') {
      updatedRequest.pickup = node;
      setSelectionStep('delivery');
    } else if (selectionStep === 'delivery') {
      updatedRequest.delivery = node;
      setRequests([...requests, updatedRequest]);
      setSelectionStep(null);
      setCurrentRequest({ warehouse: null, pickup: null, delivery: null }); // Reset for the next request
    }

    setCurrentRequest(updatedRequest);
  };

  const startNewRequest = () => {
    setSelectionStep('warehouse');
    setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
  };

  return (
    <div className="App">
      <div className="map-section">
        <PlaceholderMap
          intersections={intersections} // Pass intersections directly
          onNodeClick={(node) => console.log('Node clicked:', node)}
        />
      </div>
      <div className="planner-section">
        <DeliveryPlanner
          requests={requests}
          startNewRequest={startNewRequest}
          selectionStep={selectionStep}
        />
      </div>
    </div>
  );
}

export default App;
