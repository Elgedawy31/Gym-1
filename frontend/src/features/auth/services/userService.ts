"use server";

import serverAxios from "@/lib/axios/serverAxios";
import { API_CONFIG } from "@/config/api";
import { type IUser, type IUpdateMe } from "../types/types";
import { AxiosError } from "axios";

/**9
 * Updates the current user's data, supporting file uploads (e.g., profile picture).
 * @param data - The user data to update (FormData with IUpdateMe fields).
 * @returns A promise that resolves to the updated user's data.
 * @throws Error if the update fails.
 */
export const updateMeService = async (data: FormData): Promise<IUser> => {
  try {
    const response = await serverAxios.patch(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data.user;
  } catch (error) {
    throw new Error(
      `Failed to update user: ${
        error instanceof AxiosError && error.response
          ? error.response.data.message || error.message
          : "Unknown error"
      }`
    );
  }
};

/**
 * Fetches the current user's data from the backend.
 * @returns A promise that resolves to the current user's data.
 * @throws Error if the request fails.
 */
export const getMeService = async (): Promise<IUser> => {
  try {
    const response = await serverAxios.get(`${API_CONFIG.BASE_URL}/users/me`);
    return response.data.data.user;
  } catch (error) {
    throw new Error(
      `Failed to fetch user: ${
        error instanceof AxiosError && error.response
          ? error.response.data.message || error.message
          : "Unknown error"
      }`
    );
  }
};

/**
 * Deactivates the current user's account.
 * @returns A promise that resolves when the account is deactivated.
 * @throws Error if the request fails.
 */
export const deleteMeService = async (): Promise<void> => {
  try {
    await serverAxios.delete(`${API_CONFIG.BASE_URL}/users/delete-me`);
  } catch (error) {
    throw new Error(
      `Failed to deactivate account: ${
        error instanceof AxiosError && error.response
          ? error.response.data.message || error.message
          : "Unknown error"
      }`
    );
  }
};
