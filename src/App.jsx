import React, { useState } from "react";
import { findFastestPath } from "./api/services"; // Assurez-vous que cette fonction est correctement définie

function App() {
  const [startId, setStartId] = useState(""); // ID de départ
  const [pickupId, setPickupId] = useState(""); // ID de ramassage unique
  const [dropoffId, setDropoffId] = useState(""); // ID de dépôt unique
  const [result, setResult] = useState(null); // Résultat du chemin calculé
  const [error, setError] = useState(null); // Gestion des erreurs

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(null); // Réinitialiser l'erreur
    setResult(null); // Réinitialiser le résultat

    try {
      // Log des champs saisis
      console.log("Start ID input:", startId);
      console.log("Pickup ID input:", pickupId);
      console.log("Dropoff ID input:", dropoffId);

      // Validation des entrées
      if (!startId || isNaN(Number(startId))) {
        console.error("Start ID is invalid:", startId);
        setError("Start ID must be a valid number.");
        return;
      }
      if (!pickupId || isNaN(Number(pickupId))) {
        console.error("Pickup ID is invalid:", pickupId);
        setError("Pickup ID must be a valid number.");
        return;
      }
      if (!dropoffId || isNaN(Number(dropoffId))) {
        console.error("Dropoff ID is invalid:", dropoffId);
        setError("Dropoff ID must be a valid number.");
        return;
      }

      // Construire l'objet de requête
      const deliveryRequest = {
        startId: Number(startId), // Convertir en nombre
        pickupId: Number(pickupId), // Un seul ID de ramassage
        dropoffId: Number(dropoffId) // Un seul ID de dépôt
      };

      // Log de l'objet construit
      console.log("Prepared delivery request:", deliveryRequest);

      // Appeler l'API et loguer la réponse
      const path = await findFastestPath(deliveryRequest);
      console.log("Fastest path result:", path);

      // Stocker le résultat
      setResult(path);
    } catch (err) {
      // Log des erreurs
      console.error("Error during API call:", err.message);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Calculate Fastest Path</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Start ID:</label>
          <input
            type="number"
            value={startId}
            onChange={(e) => setStartId(e.target.value)}
            required
            style={{ marginLeft: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Pickup ID:</label>
          <input
            type="number"
            value={pickupId}
            onChange={(e) => setPickupId(e.target.value)}
            required
            style={{ marginLeft: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Dropoff ID:</label>
          <input
            type="number"
            value={dropoffId}
            onChange={(e) => setDropoffId(e.target.value)}
            required
            style={{ marginLeft: "10px" }}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Find Path
        </button>
      </form>

      {/* Affichage des erreurs */}
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Affichage des résultats */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Fastest Path Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
