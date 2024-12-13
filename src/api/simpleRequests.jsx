// api.js
export const sendRequestToBackend = async (updatedRequest) => {
    try {
        const payload = {
            warehouseId: updatedRequest.warehouse.id,
            pickupId: updatedRequest.pickup.id,
            deliveryId: updatedRequest.delivery.id,
        };

        const response = await fetch("http://localhost:8080/city-map/requests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.text();
        console.log("Request sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Error sending request to backend:", error);
        throw error; // Re-throw to allow caller to handle it
    }
};

export const fetchFastestPathData = async () => {
    try {
        const response = await fetch("http://localhost:8080/city-map/fastest-path", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); // Assume this is a list of lat/lng pairs
        console.log("Fastest path data retrieved successfully:", data);
        return data;
    } catch (error) {
        console.error("Error fetching fastest path data:", error);
        throw error;
    }
};
