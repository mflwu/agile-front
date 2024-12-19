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

export async function importXMLFile(filePath) {
    try {
        // Envoie le nom du fichier via une requête GET
        const response = await apiClient.get(`city-map/import-xml`, {
            params: { filePath }, // Ajouter le paramètre filePath dans l'URL
        });
        console.log("File successfully sent to backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending file name:", error.response?.data || error.message);
        throw error;
    }
}




