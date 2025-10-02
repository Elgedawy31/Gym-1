export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  AUTH_TOKEN_KEY: "authToken",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    },
    USERS: {
      UPDATE: (id?: string) => `/users/${id || 'me'}`,
      TOP_TRAINERS:"users?role=trainer&limit=3"
      // Add other user-related endpoints as needed
    },
  },
};

