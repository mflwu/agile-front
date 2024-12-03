import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../styles/PlaceholderMap.css';

// Custom marker icons
const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const PlaceholderMap = ({ nodes, onNodeClick, highlightNodes }) => {
  const center = [48.8566, 2.3522]; // Center of the map

  const getMarkerIcon = (node) => {
    if (highlightNodes) {
      if (highlightNodes.warehouse === node.id) return createIcon('green');
      if (highlightNodes.pickup === node.id) return createIcon('blue');
      if (highlightNodes.delivery === node.id) return createIcon('red');
    }
    return createIcon('grey'); // Default marker
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {nodes.map((node) => (
        <Marker
          key={node.id}
          position={[node.lat, node.lng]}
          icon={getMarkerIcon(node)}
          eventHandlers={{
            click: () => onNodeClick(node),
          }}
        >
          <Popup>
            Node {node.id}
            <br />
            Lat: {node.lat}, Lng: {node.lng}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PlaceholderMap;
