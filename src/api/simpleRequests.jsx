export const sendRequestToBackend = async (payload) => {
    console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch("http://localhost:8080/city-map/optimize-sequence", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log(`Request sent. Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response from backend:", errorText);
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); // Supposer que la réponse est JSON
        console.log("Response received from backend:", JSON.stringify(data, null, 2));

        return data;
    } catch (error) {
        console.error("Error during fetch operation:", error.message);
        console.error("Error stack trace:", error.stack);
        throw error; // Re-throw pour permettre au code appelant de gérer l'erreur
    }
};
