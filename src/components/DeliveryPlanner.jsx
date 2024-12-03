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
    const [selectionStep, setSelectionStep] = useState(null);
    const [selectedRequestIndex, setSelectedRequestIndex] = useState(null);
  
    const nodes = [
      { id: 'A', lat: 0, long: 0 },
      { id: 'B', lat: 1, long: 1 },
      { id: 'C', lat: 2, long: 2 },
    ]; // Placeholder nodes
  
    const handleNodeClick = (node) => {
      if (!selectionStep) return;
  
      if (selectionStep === 'warehouse') {
        setCurrentRequest({ ...currentRequest, warehouse: node.id });
        setSelectionStep('pickup');
      } else if (selectionStep === 'pickup') {
        setCurrentRequest({ ...currentRequest, pickup: node.id });
        setSelectionStep('delivery');
      } else if (selectionStep === 'delivery') {
        setCurrentRequest({ ...currentRequest, delivery: node.id });
        setSelectionStep(null);
        setRequests([...requests, { ...currentRequest, delivery: node.id }]);
        setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
      }
    };
  
    const startNewRequest = () => {
      setSelectionStep('warehouse');
      setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
    };
  
    const handleRequestClick = (index) => {
      setSelectedRequestIndex(index);
    };
  
    return (
      <div className="delivery-planner" style={{ display: 'flex', height: '100vh' }}>
        <div className="map-container" style={{ flex: 2, borderRight: '1px solid black' }}>
          <PlaceholderMap
            nodes={nodes}
            onNodeClick={handleNodeClick}
            highlightNodes={selectedRequestIndex !== null ? requests[selectedRequestIndex] : null}
          />
        </div>
        <div className="requests-container" style={{ flex: 1, padding: '10px' }}>
          <h3>Delivery Requests</h3>
          <ul>
            {requests.map((req, index) => (
              <li
                key={index}
                onClick={() => handleRequestClick(index)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedRequestIndex === index ? '#e0e0e0' : 'transparent',
                }}
              >
                {`Warehouse: ${req.warehouse}, Pickup: ${req.pickup}, Delivery: ${req.delivery}`}
              </li>
            ))}
          </ul>
          <button onClick={startNewRequest}>+ Create New Request</button>
        </div>
      </div>
    );
  };
  
  export default DeliveryPlanner;
  
