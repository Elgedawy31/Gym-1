// hooks/auth.ts
import { useMutation } from "@tanstack/react-query";
import { signupService, loginService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { AuthRes, LoginFormValues, SignupFormValues } from "@/types/authType";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Shared mutation options for consistency
export const mutationOptions = {
  retry: (failureCount: number, error: unknown) => {
    if (
      error instanceof Error &&
      (error.message.includes("401") || error.message.includes("403"))
    ) {
      return false; // No retry for unauthorized or forbidden errors
    }
    return failureCount < 2; // Retry up to 2 times for other errors
  },
};

/**
 * Custom hook for handling signup with Tanstack Query.
 * Updates the auth store and shows toast notifications on success/error.
 * @returns A mutation hook for signup
 */
export const useSignup = () => {
  const router = useRouter();
  const { setAuth} = useAuthStore()
  return useMutation<AuthRes, Error, SignupFormValues>({
    mutationKey: ["signup"],
    mutationFn: signupService,
    ...mutationOptions,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/");
      toast.success("Signed up successfully!");
    },
    onError: (error) => {
      console.error("Signup failed:", error.message);
      toast.error(`Signup failed: ${error.message}`);
    },
  });
};

/**
 * Custom hook for handling login with Tanstack Query.
 * Updates the auth store and shows toast notifications on success/error.
 * @returns A mutation hook for login
 */
export const useLogin = () => {
  const router = useRouter();
  const { setAuth} = useAuthStore();
  return useMutation<AuthRes, Error, LoginFormValues>({
    mutationKey: ["login"],
    mutationFn: loginService,
    ...mutationOptions,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/");
      toast.success("Logged in successfully!");
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      toast.error(`Login failed: ${error.message}`);
    },
  });
}