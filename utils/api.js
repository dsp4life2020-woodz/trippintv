import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = 'http://localhost:3000'; // Your Node.js API server URL
const DUMMY_TOKEN_COOKIE_NAME = 'user_auth_token';
const DUMMY_USER_ID = 1; // Assuming 'Damion' (the first user you created) is ID 1
// --- Simulates User.login() ---
export const login = async () => {
    // Sets a dummy token to signal the user is "logged in"
    Cookies.set(DUMMY_TOKEN_COOKIE_NAME, 'fake_auth_token_123', { expires: 7 });
    return { success: true };
};
/ --- Simulates User.logout() ---
export const logout = async () => {
    Cookies.remove(DUMMY_TOKEN_COOKIE_NAME);
    return { success: true };
};
/ --- Simulates User.me() (Fetches data from your Node.js API) ---
export const getMyProfile = async () => {
    // Check if the dummy token exists
    if (!Cookies.get(DUMMY_TOKEN_COOKIE_NAME)) {
        return null; // Not logged in
    }
    try {
        // This is the actual call to your new PostgreSQL-backed API
        const response = await axios.get(`${API_BASE_URL}/users/${DUMMY_USER_ID}`);
        const user = response.data;
        // Map database fields to what your React component expects:
        user.full_name = user.name;
        user.created_date = user.created_at || new Date().toISOString();
        user.email = user.email || 'user@example.com';
        return user;
    } catch (error) {
        // Log the error if the API is unreachable or the user ID doesn't exist
        console.error("API error fetching user:", error);
        return null;
    }
};
/ --- Placeholder functions for Video and Trip data ---
/ These return empty arrays to prevent errors in Profile.js until you build these API endpoints.
export const filterVideos = async (filter) => {
    return [];
};
export const filterTrips = async (filter) => {
    return [];
};
