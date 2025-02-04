import axios from "axios";

const API_URL = "https://your-backend.com/api/firestations"; // 실제 API 주소로 변경

export const getFireStations = async (lat: number, lng: number) => {
    try {
        const response = await axios.get(`${API_URL}?lat=${lat}&lng=${lng}`);
        return response.data; // [{ name: "소방서1", lat: 37.5, lng: 126.9 }, ...]
    } catch (error) {
        console.error("Error fetching fire stations:", error);
        return [];
    }
};