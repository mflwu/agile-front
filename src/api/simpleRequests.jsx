// api.js
export const sendRequestToBackend = async (updatedRequest) => {
    try {
        const payload = {
            warehouseId: updatedRequest.warehouse.id,
            pickupId: updatedRequest.pickup.id,
            deliveryId: updatedRequest.delivery.id,
        };

        const response = await fetch("http://localhost:8080/delivery/requests", {
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

export const fetchRouteCoordinates = async (nodeIds) => {
    try {
        const response = await fetch("http://localhost:8080/route-coordinates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nodeIds),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch route coordinates");
        }

        return response.json(); // Returns a list of coordinates
    } catch (error) {
        console.error("Error fetching route coordinates:", error);
        throw error;
    }
};
