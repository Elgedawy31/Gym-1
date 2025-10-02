// // services/auth.ts
// import api from "@/lib/axios";
// import type { IUpdateMe, IUser } from "@/types/authType";
// import { AxiosError } from "axios";

// /**
//  * Fetches the current user's data from the backend.
//  * @returns A promise that resolves to the current user's data.
//  * @throws Error if the request fails.
//  */
// export const getMeService = async (): Promise<IUser> => {
//   try {
//     const res = await api.get("/users/me");
//     return res.data.user;
//   } catch (error) {
//     throw new Error(
//       `Failed to fetch user: ${
//         error instanceof AxiosError && error.response
//           ? error.response.data.message || error.message
//           : "Unknown error"
//       }`
//     );
//   }
// };

// /**
//  * Updates the current user's data, supporting file uploads (e.g., profile picture).
//  * @param data - The user data to update (IUpdateMe type).
//  * @param hasFile - Optional flag to indicate if a file is included (for multipart/form-data).
//  * @returns A promise that resolves to the updated user's data.
//  * @throws Error if the update fails.
//  */
// export const updateMeService = async (data: IUpdateMe): Promise<IUser> => {
//   try {
//     const res = await api.patch("/users/update-me", data, 
//       { headers: { 
//         "Content-Type": "multipart/form-data" 
//       } }
//     );
//     return res.data.user;
//   } catch (error) {
//     throw new Error(
//       `Failed to update user: ${
//         error instanceof AxiosError && error.response
//           ? error.response.data.message || error.message
//           : "Unknown error"
//       }`
//     );
//   }
// };

// /**
//  * Deactivates the current user's account.
//  * @returns A promise that resolves when the account is deactivated.
//  * @throws Error if the request fails.
//  */
// export const deleteMeService = async (): Promise<void> => {
//   try {
//     await api.delete("/users/delete-me");
//   } catch (error) {
//     throw new Error(
//       `Failed to deactivate account: ${
//         error instanceof AxiosError && error.response
//           ? error.response.data.message || error.message
//           : "Unknown error"
//       }`
//     );
//   }
// };