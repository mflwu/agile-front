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
    const [selectionStep, setSelectionStep] = useState(null); // null, "warehouse", "pickup", "delivery"
    const [selectedRequestIndex, setSelectedRequestIndex] = useState(null); // For highlighting
    const [promptMessage, setPromptMessage] = useState(''); // For user prompts

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
        setPromptMessage('Choose a pickup point');
        } else if (selectionStep === 'pickup') {
        setCurrentRequest({ ...currentRequest, pickup: node.id });
        setSelectionStep('delivery');
        setPromptMessage('Choose a delivery point');
        } else if (selectionStep === 'delivery') {
        setCurrentRequest({ ...currentRequest, delivery: node.id });
        setSelectionStep(null); // End selection
        setRequests([...requests, { ...currentRequest, delivery: node.id }]);
        setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
        setPromptMessage(''); // Clear prompt
        }
    };

    const startNewRequest = () => {
        setSelectionStep('warehouse');
        setPromptMessage('Choose a warehouse');
        setCurrentRequest({ warehouse: null, pickup: null, delivery: null });
        setSelectedRequestIndex(null); // Clear selected request
    };

    const handleRequestClick = (index) => {
        // Toggle selection of a request
        if (selectedRequestIndex === index) {
        setSelectedRequestIndex(null); // Unselect if already selected
        } else {
        setSelectedRequestIndex(index);
        }
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
            <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{promptMessage}</p>
        </div>
        </div>
    );
    };

    export default DeliveryPlanner;
