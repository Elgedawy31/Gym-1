// // lib/axios.ts
// import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";

// /**
//  * Creates and configures a custom Axios instance for API requests.
//  * Handles token authentication, error handling, and common configurations.
//  * 
//  * @returns {AxiosInstance} Configured Axios instance
//  */
// const createApiInstance = (): AxiosInstance => {
//   const api: AxiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api", // Fallback للـ dev
//     timeout: 10000,
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//       const token = Cookies.get("token");
//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }

//       if (process.env.NODE_ENV === "development") {
//         console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
//       }
//       return config;
//     },
//     (error: AxiosError) => {
//       console.error("[API Request Error]", error);
//       return Promise.reject(error);
//     }
//   );

//   api.interceptors.response.use(
//     (response) => {
//       if (process.env.NODE_ENV === "development") {
//         console.log(`[API Response] ${response.status} ${response.config.url}`);
//       }
//       return response.data; 
//     },
//     async (error: AxiosError) => {
//       const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//           // return api(originalRequest);
//           console.warn("[API] Token expired, please login again.");
//           if (typeof window !== "undefined") {
//             window.location.href = "/login";
//           }
//         } catch (refreshError) {
//           console.error("[API Refresh Error]", refreshError);
//         }
//         return Promise.reject(error);
//       }

//       console.error(`[API Error] ${error.response?.status}: ${error.message}`);
//       return Promise.reject(error);
//     }
//   );

//   return api;
// };

// const api = createApiInstance();

// export default api;