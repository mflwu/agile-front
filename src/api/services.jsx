import axios from "axios";

const API_URL = "http://localhost:8080/city-map"; // URL de base pour les appels API

// Fonction pour charger la carte
export const loadCityMap = async () => {
    try {
      const response = await axios.get(`${API_URL}/loadmap`);
      return response.data; // Message de succès
    } catch (error) {
      throw new Error(
        error.response?.data || "An error occurred while loading the city map."
      );
    }
  };

/**
 * Trouve le chemin le plus rapide en envoyant une requête POST au back-end.
 * @param {Object} deliveryRequest - Objet contenant startId, pickupId, et dropoffId.
 * @returns {Promise<Array<number>>} - Résultat de l'API (chemin le plus rapide).
 */
export const findFastestPath = async (deliveryRequest) => {
    try {
      console.log("Sending request to back-end:", deliveryRequest); // Log des données envoyées
      const response = await axios.post("http://localhost:8080/city-map/fastest-path", deliveryRequest);
      console.log("Response from back-end:", response.data); // Log des données reçues
      return response.data;
    } catch (error) {
      console.error("Error from back-end:", error.response?.data || error.message); // Log des erreurs
      throw error;
    }
  };
  
  