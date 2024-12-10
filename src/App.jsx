import React from 'react';
import DeliveryPlanner from './components/DeliveryPlanner';
import PlaceholderMap from './components/PlaceholderMap'; // Import the map component
import './styles/App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
      <div className="map-section">
        <PlaceholderMap
          nodes={[
            { id: 1, lat: 45.764043, lng: 4.835659 }, // Lyon Center
            { id: 2, lat: 45.750000, lng: 4.850000 }, // Example point in Lyon
            { id: 3, lat: 45.770000, lng: 4.820000 }, // Another point in Lyon
          ]}
          onNodeClick={(node) => console.log('Node clicked:', node)}
          highlightNodes={{ warehouse: 1, pickup: 2, delivery: null }}
        />
      </div>
      <div className="planner-section">
        <DeliveryPlanner />
      </div>
    </div>
  );
}

export default App;
