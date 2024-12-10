import React, { useState } from 'react';
import PlaceholderMap from './PlaceholderMap';
import '../styles/DeliveryPlanner.css';

const DeliveryPlanner = () => {
  const [requests, setRequests] = useState([]);
  const [currentRequest, setCurrentRequest] = useState({
    warehouse: null,
    pickup: null,
    delivery: null,
  });
  const [selectionStep, setSelectionStep] = useState(null); // 'warehouse', 'pickup', 'delivery'
  const [highlightNodes, setHighlightNodes] = useState(null); // For node highlighting

  const nodes = [
    { id: 1, lat: 48.8566, lng: 2.3522 },
    { id: 2, lat: 48.864716, lng: 2.349014 },
    { id: 3, lat: 48.860611, lng: 2.337644 },
  ]; // Example nodes

  const handleNodeClick = (node) => {
    if (!selectionStep) return;

    if (selectionStep === 'warehouse') {
      setCurrentRequest({ ...currentRequest, warehouse: node.id });
      setSelectionStep('pickup');
      setHighlightNodes({ warehouse: node.id });
    } else if (selectionStep === 'pickup') {
      setCurrentRequest({ ...currentRequest, pickup: node.id });
      setSelectionStep('delivery');
      setHighlightNodes({ ...highlightNodes, pickup: node.id });
    } else if (selectionStep === 'delivery') {
      setCurrentRequest({ ...currentRequest, delivery: node.id });
      setRequests([...requests, { ...currentRequest, delivery: node.id }]);
      setSelectionStep(null);
      setHighlightNodes(null);
      setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
    }
  };

  const startNewRequest = () => {
    setSelectionStep('warehouse');
    setHighlightNodes(null);
  };

  return (
    <div className="delivery-planner" style={{ display: 'flex', height: '100vh' }}>
      <div className="map-container" style={{ flex: 2, borderRight: '1px solid #ddd' }}>
        <PlaceholderMap
          nodes={nodes}
          onNodeClick={handleNodeClick}
          highlightNodes={highlightNodes}
        />
      </div>
      <div className="planner-container" style={{ flex: 1, padding: '20px', background: '#f9f9f9' }}>
        <h3>Delivery Planner</h3>
        <button onClick={startNewRequest} style={{ marginBottom: '20px' }}>
          + Start New Request
        </button>
        <ul>
          {requests.map((req, index) => (
            <li key={index}>
              {`Warehouse: ${req.warehouse}, Pickup: ${req.pickup}, Delivery: ${req.delivery}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DeliveryPlanner;
