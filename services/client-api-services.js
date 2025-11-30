// This file acts as the bridge between your frontend UI and your backend API.

const BASE_URL = 'http://localhost:3000/users';

export const registerUser = async (userData) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('User registration failed.');
    }

    return response.json();
};
