import React, { useEffect, useState } from "react";
import DeliveryPlanner from "./components/DeliveryPlanner";
import PlaceholderMap from "./components/PlaceholderMap";
import { sendRequestToBackend } from "./api/Services";
import "./styles/App.css";
import "leaflet/dist/leaflet.css";

function App() {
	const [tours, setTours] = useState([]);
	const [currentTour, setCurrentTour] = useState({
		courier: null,
		warehouse: null,
		requests: [],
	});
	const [selectionStep, setSelectionStep] = useState(null);
	const [intersections, setIntersections] = useState([]);
	const [route, setRoute] = useState([]);

	useEffect(() => {
		const fetchIntersections = async () => {
			try {
				const response = await fetch("http://localhost:8080/city-map/loadmap");
				if (!response.ok) {
					throw new Error("Failed to load city map");
				}
				const data = await response.json();
				setIntersections(data.intersections || []); // Set intersections
			} catch (error) {
				console.error("Error fetching city map:", error);
				setIntersections([]); // Fallback to empty list
			}
		};

		fetchIntersections();
	}, []);

	const handleFileUpload = async (event) => {
		const file = event.target.files[0]; // Récupérer le fichier sélectionné
		if (!file) return;

		try {
			const response = await importXMLFile(file); // Envoyer le fichier au back-end
			console.log("Processed data from XML:", response);
			// Mettre à jour l'état ou effectuer une action avec les données reçues
		} catch (error) {
			console.error("Failed to process XML file:", error);
		}
	};

	

	const handleNodeClick = async (node) => {
		if (!selectionStep) return;

		const updatedTour = { ...currentTour };

		if (selectionStep === "courier") {
			alert(
				"Select a courier before choosing a warehouse, pickup or delivery location."
			);
			return;
		} else if (selectionStep === "warehouse") {
			updatedTour.warehouse = node;
			setSelectionStep("pickup");
		} else if (selectionStep === "pickup") {
			updatedTour.requests.push({ pickup: node, delivery: null });
			setSelectionStep("delivery");
		} else if (selectionStep === "delivery") {
			// Assurez-vous qu'il y a au moins une requête pour ajouter la livraison
			if (updatedTour.requests.length === 0) {
				alert(
					"Please add a pickup request before selecting a delivery location."
				);
				return;
			}

			// Ajoute la livraison à la dernière requête
			updatedTour.requests[updatedTour.requests.length - 1].delivery = node;
			setSelectionStep("pickup");

			// try {
            //     // Construire le payload directement ici
            //     const payload = {
            //         start: updatedTour.warehouse.id,
            //         pickups: updatedTour.requests.map((req) => req.pickup.id),
            //         dropoffs: updatedTour.requests.map((req) => req.delivery.id),
            //     };
    
            //     console.log("Payload to send to backend:", JSON.stringify(payload, null, 2));
    
            //     // Envoyer les données au backend
            //     const response = await sendRequestToBackend(payload);
    
            //     console.log("Response from backend:", response);
    
            //     // Gestion de la réponse si nécessaire (affichage, mise à jour d'état)
            //     const parsedResponse = JSON.parse(response);
            //     const routeData = parsedResponse.map(([latitude, longitude]) => ({
            //         lat: latitude,
            //         lng: longitude,
            //     }));
            //     console.log("Received route data:", routeData);
            //     setRoute(routeData); // Mettre à jour le trajet affiché sur la carte
            // } catch (error) {
            //     console.error("Error sending request to backend:", error);
            // }
        

			// Met à jour le tour actuel sans l'ajouter à `tours`
			setCurrentTour(updatedTour);
		}

		// Met à jour l'état du tour actuel
		setCurrentTour(updatedTour);
	};

	

	const startNewTour = () => {
		setSelectionStep("courier");
		setCurrentTour({
			courier: null,
			warehouse: null,
			requests: [],
		});
	};

	const finalizeTour = async () => {
        if (
            currentTour.courier &&
            currentTour.warehouse &&
            currentTour.requests.length > 0 &&
            currentTour.requests.every((req) => req.pickup && req.delivery)
        ) {
            try {
                // Create the payload
                const payload = {
                    start: Number(currentTour.warehouse.id),
                    pickups: currentTour.requests.map((req) => req.pickup.id),
                    dropoffs: currentTour.requests.map((req) => req.delivery.id),
					courier : currentTour.courier.id
                };
        
                console.log("Payload to be sent to backend:", payload); // Debugging
        
                // Send the data to the backend
                const response = await sendRequestToBackend(payload);
        
                console.log("Backend response:", response); // Debugging
                
                // Parse the route from the response
                const parsedRoute = response.map(([lat, lng]) => ({ lat, lng }));
        
                // Add the route to the current tour
                const updatedTour = { ...currentTour, route: parsedRoute };
        
                // Add the updated tour to the list of tours
                setTours([...tours, updatedTour]);

                setRoute(parsedRoute); 
        
                // Reset for a new tour
                setCurrentTour({
                    courier: null,
                    warehouse: null,
                    requests: [],
                });
                setSelectionStep(null);
            } catch (error) {
                console.error("Error sending payload to backend:", error);
                alert("An error occurred while finalizing the tour. Please try again.");
            }
        } else {
            alert(
                "The tour is not complete. Make sure you have selected a courier, a warehouse, and at least one complete request."
            );
        }
    };
    
    

	return (
		<div className="App">
			<div className="map-section">
				<PlaceholderMap
					intersections={intersections}
					tours={tours}
					onNodeClick={handleNodeClick}
					selectionStep={selectionStep}
					currentTour={currentTour}
					route={route}
				/>
			</div>
			<div className="planner-section">
				<DeliveryPlanner
					startNewTour={startNewTour}
					setTours={setTours} // Passez setTours comme prop ici
					tours={tours}
					setCurrentTour={setCurrentTour}
					selectionStep={selectionStep}
					setSelectionStep={setSelectionStep}
					finalizeTour={finalizeTour}
                    setRoute={setRoute}
				/>
			</div>
		</div>
	);
}

export default App;
