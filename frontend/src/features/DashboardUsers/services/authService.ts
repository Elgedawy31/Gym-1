// 'use server'

// import api from "@/lib/axios";
// import type { AuthRes, LoginFormValues, SignupFormValues } from "@/types/authType";
// import type { AxiosError } from "axios";

// /**
//  * Sends a signup request to the server with user data.
//  * @param data - The signup form values (e.g., name, email, password, etc.)
//  * @returns A promise that resolves to the authentication response
//  * @throws Error if the signup request fails
//  */
// export const signupService = async (data: SignupFormValues): Promise<AuthRes> => {
//   try {
//     const res = await api.post<AuthRes>("/auth/signup", data, {
//       headers: {
//         "Content-Type": "multipart/form-data", // For file uploads (e.g., profile picture)
//       },
//     });
    
//     return res.data;
//   }  catch (err) {
//     const error = err as AxiosError<{ message: string }>;
//     throw new Error(error.response?.data?.message || "Failed to log in");
//   }
// }

// /**
//  * Sends a login request to the server with user credentials.
//  * @param data - The login form values (e.g., email, password)
//  * @returns A promise that resolves to the authentication response
//  * @throws Error if the login request fails
//  */
// export const loginService = async (data: LoginFormValues): Promise<AuthRes> => {
//   try {
//     const res = await api.post<AuthRes>("/auth/login", data);
    
//     return res.data;
//   }  catch (err) {
//     const error = err as AxiosError<{ message: string }>;
//     throw new Error(error.response?.data?.message || "Failed to log in");
//   }
// }