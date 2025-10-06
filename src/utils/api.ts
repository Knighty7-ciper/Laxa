// Placeholder for a generic API request formatter or wrapper.
// This can be used to standardize fetch calls, add headers, handle errors, etc.

const BASE_URL = 'https://your-api-url.com/rest/v1';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const { headers, ...customOptions } = options;
    const config: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${getAuthToken()}`,
            ...headers,
        },
        ...customOptions,
    };

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, config);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};
