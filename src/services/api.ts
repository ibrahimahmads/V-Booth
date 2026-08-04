import axios from "axios";
import { BASE_URL } from "../utils/constant/constant-api";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "any-value",
    },
    timeout: 10000,
});

// api.interceptors.request.use((config) => {
//     const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
// });

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.log("API ERROR: ", error.response?.data || error.message)
//         return Promise.reject(error)
//     }
// )


