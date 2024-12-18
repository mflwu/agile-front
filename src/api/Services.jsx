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

// Importer un fichier XML pour traitement
export async function importXMLFile(fileName) {
    try {
        const payload = { filePath: fileName }; // Assure-toi que la clé correspond à ce que le back-end attend

        const response = await apiClient.post(`/import-xml`, payload);

        console.log("File name sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending file name:", error.response?.data || error.message);
        throw error;
    }
}




