import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const getFacilities = async (type = null, building = null) => {
    try {
        const params = {};
        if (type) params.type = type;
        if (building) params.building = building;

        const response = await axios.get(`${API_BASE_URL}/facilities`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        return [];
    }
};

export const searchFacilities = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search`, { params: { q: query } });
        return response.data;
    } catch (error) {
        console.error('Error searching facilities:', error);
        return [];
    }
};

export const getRoute = async (startId, endId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/route`, { params: { start_id: startId, end_id: endId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
};
