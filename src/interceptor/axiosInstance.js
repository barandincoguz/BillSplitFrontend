// axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Replace with your API's base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding the token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from local storage or wherever it's stored
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., token expiration)
            console.warn('Token expired or unauthorized access. Logging out...');
            localStorage.removeItem('token');
            // Optionally, redirect to the login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;