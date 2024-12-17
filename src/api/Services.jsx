import axios from "axios";

const API_URL = "http://localhost:8080";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Envoyer une requête de livraison
export async function sendRequestToBackend(payload) {
    console.log("Payload to backend:", payload);

    try {
        const response = await apiClient.post(`/city-map/optimize-sequence`, payload);
        console.log("Response from backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending request to backend:", error.response?.data || error.message);
        throw error;
    }
}

// Récupérer les intersections
export async function fetchIntersections() {
    try {
        const response = await apiClient.get(`/city-map/loadmap`);
        console.log("Intersections loaded:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching intersections:", error.response?.data || error.message);
        throw error;
    }
}

// Récupérer les coordonnées des trajets optimisés
export async function fetchRouteCoordinates(nodeIds) {
    try {
        const response = await apiClient.post(`/route-coordinates`, nodeIds);
        return response.data;
    } catch (error) {
        console.error("Error fetching route coordinates:", error.response?.data || error.message);
        throw error;
    }
}
