import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useOutletContext } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { getFacilities, getRoute } from '../services/api';
import L from 'leaflet';

// Helper component to adjust map view based on route
function RouteViewAdjuster({ routeData }) {
    const map = useMap();
    useEffect(() => {
        if (routeData && routeData.path) {
            const bounds = L.latLngBounds(routeData.path.map(p => [p.y, p.x]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [routeData, map]);
    return null;
}

// Function to generate colored div icons
const getIconForType = (type) => {
    let color = '#3b82f6'; // default blue
    switch (type) {
        case 'classroom': color = '#eab308'; break; // yellow
        case 'laboratory': color = '#22c55e'; break; // green
        case 'office': color = '#8b5cf6'; break; // purple
        case 'cafeteria': color = '#f97316'; break; // orange
        case 'library': color = '#06b6d4'; break; // cyan
        case 'restroom': color = '#64748b'; break; // slate
        case 'parking': color = '#1e293b'; break; // dark slate
        case 'gym': color = '#ef4444'; break; // red
    }

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10]
    });
};

function MapView() {
    const { currentRoute } = useOutletContext();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [routeData, setRouteData] = useState(null);

    // Center on the new Stanford mock data: 37.4275, -122.1697
    const mapCenter = [37.4275, -122.1697];
    const zoomLevel = 16; // Zoomed in to see campus buildings clearly

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await getFacilities();
            if (data) {
                setFacilities(data);
            }
            setLoading(false);
        };

        loadData();
    }, []);

    useEffect(() => {
        const fetchRoute = async () => {
            if (currentRoute?.startId && currentRoute?.endId) {
                setLoading(true);
                const data = await getRoute(currentRoute.startId, currentRoute.endId);
                setRouteData(data);
                setLoading(false);
            } else {
                setRouteData(null);
            }
        };
        fetchRoute();
    }, [currentRoute]);

    // Transform backend path {x, y} to Leaflet Polyline format [[lat, lng]]
    const polylinePositions = routeData?.path ? routeData.path.map(p => [p.y, p.x]) : [];

    const handleLocateMe = () => {
        // Simulate finding the user near the Main Academic Center
        alert("Location found: You are near the Main Lecture Hall.");
    };

    return (
        <div className="w-full h-full relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Map Content */}
            <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                scrollWheelZoom={true}
                className="h-full w-full z-10"
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Render Markers for each facility */}
                {!loading && facilities.map((facility) => (
                    <Marker
                        key={facility.id}
                        // Leaflet uses [lat, lng]. We pretend our mock x,y are coordinates.
                        // In a real app, 'x' might be longitude and 'y' latitude, so map appropriately.
                        position={[facility.location.y, facility.location.x]}
                        icon={getIconForType(facility.type)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1">
                                <h3 className="font-bold text-gray-800 text-base mb-1">{facility.name}</h3>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <p><span className="font-semibold">{facility.building}</span> • Floor {facility.floor}</p>
                                    <p className="capitalize badge bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md inline-block mt-1">
                                        {facility.type}
                                    </p>
                                    <p className="mt-2 block italic text-gray-500">{facility.description}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Draw Route Polyline */}
                {routeData && routeData.path && (
                    <>
                        <Polyline
                            positions={polylinePositions}
                            pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10, 10' }} // Blue dashed line
                        />
                        <RouteViewAdjuster routeData={routeData} />
                    </>
                )}
            </MapContainer>

            {/* Optional Overlay for Instructions */}
            {routeData && (
                <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-80 max-h-[80vh] overflow-y-auto">
                    <h4 className="font-bold text-gray-900 text-base mb-3 border-b border-gray-100 pb-3 flex items-center gap-2">
                        <div className="p-1.5 bg-brand-50 rounded-md text-brand-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        Navigation Route
                    </h4>

                    <div className="space-y-4">
                        <div className="flex bg-gray-50/80 rounded-xl p-3 items-center justify-between border border-gray-100/50">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Distance</span>
                                <span className="text-sm font-bold text-gray-800">{Math.round(routeData.distance_estimate_meters)} m</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Est. Time</span>
                                <span className="text-sm font-bold text-brand-600">
                                    {Math.ceil(routeData.distance_estimate_meters / 80)} min walk
                                </span>
                            </div>
                        </div>

                        <ul className="space-y-3 mt-4">
                            {routeData.instructions.map((inst, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="bg-brand-100 text-brand-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0 ring-4 ring-brand-50">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 leading-snug pt-0.5">{inst}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Locate Me Floating Action Button */}
            <button
                onClick={handleLocateMe}
                className="absolute bottom-8 right-8 z-[400] bg-white text-gray-700 hover:text-brand-600 p-4 rounded-full shadow-lg border border-gray-100 transition-all hover:scale-105 hover:shadow-xl focus:outline-none"
                title="Find My Location"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            </button>

        </div>
    );
}

export default MapView;
