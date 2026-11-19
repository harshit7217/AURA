const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiRequest = async (path, options = {}) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
};
