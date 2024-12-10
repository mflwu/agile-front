import React from 'react';
import '../styles/DeliveryPlanner.css';

const DeliveryPlanner = ({ requests, startNewRequest, selectionStep }) => {
  const getStepMessage = () => {
    if (selectionStep === 'warehouse') return 'Click on the map to select the warehouse.';
    if (selectionStep === 'pickup') return 'Click on the map to select the pickup location.';
    if (selectionStep === 'delivery') return 'Click on the map to select the delivery location.';
    return 'Press the button to start creating a new delivery.';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Delivery Planner</h3>
      <button onClick={startNewRequest} style={{ marginBottom: '20px' }}>
        + Start New Request
      </button>
      <p>{getStepMessage()}</p>
      <ul>
        {requests.map((req, index) => (
          <li key={index}>
            {`Warehouse: (${req.warehouse.lat}, ${req.warehouse.lng}), Pickup: (${req.pickup.lat}, ${req.pickup.lng}), Delivery: (${req.delivery.lat}, ${req.delivery.lng})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryPlanner;
