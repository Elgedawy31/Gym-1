"use server";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import serverAxios from "@/lib/axios/serverAxios";
import { type IUser } from "../types";
import { API_CONFIG } from "@/config/api";


export async function authAction(formData: FormData, endPoint: string) {
  try {
    const response = await serverAxios.post(API_CONFIG.BASE_URL + endPoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const responseData = response?.data;

    const token = responseData?.data?.token;
    if (token) {
      (await cookies()).set("token", token, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return responseData;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message || "Something went wrong during login";

    return {
      success: false,
      message,
    };
  }
}


/* ~~~~~~~~~~~~ get profile action ~~~~~~~~~~~~ */

export async function getProfile(): Promise<{
  user: IUser | null;
  token: string | null;
}> {
  if (!(await cookies()).get("token")) {
    return {
      user: null,
      token: null,
    };
  }
  
  
  try {
    const response = await serverAxios.get(`${API_CONFIG.BASE_URL}/users/me`);
    const token = (await cookies()).get("token")?.value || null;

    return {
      user: response.data.data.user || null,
      token,
    };
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return {
      user: null,
      token: null,
    };
  }
}

/* ~~~~~~~~~~~~ logout action ~~~~~~~~~~~~ */


export async function logOutAction() {
  (await cookies()).delete("token");
  revalidatePath("/", "layout"); 
  return { success: true };
}
