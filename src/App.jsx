import React, { useState } from 'react';
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
          nodes={[
            { id: 1, lat: 45.764043, lng: 4.835659 }, // Lyon Center
            { id: 2, lat: 45.750000, lng: 4.850000 }, // Example point in Lyon
            { id: 3, lat: 45.770000, lng: 4.820000 }, // Another point in Lyon
          ]}
          onNodeClick={handleNodeClick}
          highlightNodes={{
            warehouse: currentRequest.warehouse?.id,
            pickup: currentRequest.pickup?.id,
            delivery: currentRequest.delivery?.id,
          }}
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
