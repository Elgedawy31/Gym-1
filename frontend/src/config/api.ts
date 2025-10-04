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
      TOP_TRAINERS:"users/top-trainers?limit=3"
      // Add other user-related endpoints as needed
    },
    PRODUCTS: {
      GET_PRODUCTS: "/products",
      GET_HOME_PRODUCTS_BY_TYPE :(type: string, limit: number) => `/products?type=${type}&limit=${limit}`,
      GET_PRODUCTS_BY_TYPE: (type: string, limit: number, page: number = 1, search?: string) => `/products?type=${type}&limit=${limit}&page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    },
  },
};

