// src/App.js
import React from 'react';
import DeliveryPlanner from './components/DeliveryPlanner';
import './styles/App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
      <DeliveryPlanner />
    </div>
  );
}

export default App;
