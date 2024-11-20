// src/API/api.js
import axios from 'axios';
import { getStatisticalEquipmentRoute } from '../API/APIRouter';

export const fetchStatisticalEquipment = async () => {
    try {
        const response = await axios.get(getStatisticalEquipmentRoute);
        return response.data.data;
    } catch (err) {
        console.error("Error fetching statistical equipment data:", err);
        throw new Error("Failed to load data. Please try again later.");
    }
};
