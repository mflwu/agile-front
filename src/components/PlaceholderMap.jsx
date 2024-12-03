import React from 'react';
import '../styles/PlaceholderMap.css';

const PlaceholderMap = ({ nodes, onNodeClick, highlightNodes }) => {
  const getNodeStyle = (node) => {
    if (highlightNodes) {
      if (highlightNodes.warehouse === node.id) return { backgroundColor: 'green' };
      if (highlightNodes.pickup === node.id) return { backgroundColor: 'blue' };
      if (highlightNodes.delivery === node.id) return { backgroundColor: 'red' };
    }
    return {};
  };

  return (
    <div className="map-placeholder" style={{ height: '100%', border: '1px solid gray' }}>
      <h4>Map Placeholder</h4>
      <div>
        {nodes.map((node) => (
          <button
            key={node.id}
            style={{
              margin: '5px',
              padding: '10px',
              border: '1px solid black',
              cursor: 'pointer',
              ...getNodeStyle(node),
            }}
            onClick={() => onNodeClick(node)}
          >
            {`Node ${node.id}`}
          </button>
        ))}
      </div>
    </div>
  );
};


export default PlaceholderMap;
