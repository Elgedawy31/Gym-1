// 'use client'

// import { mutationOptions } from './actions';
// import { useEffect } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { getMeService, updateMeService } from "@/services/userService";
// import { useAuthStore } from "@/store/authStore";
// import type { IUpdateMe, IUser } from "@/types/authType";
// import toast from 'react-hot-toast';

// // Retry logic for query
// const queryOptions = {
//   retry: (failureCount: number, error: unknown) => {
//     if (error instanceof Error && error.message.match(/401|403/)) {
//       return false; // No retry for unauthorized/forbidden
//     }
//     return failureCount < 2; // Retry up to 2 times
//   },
// };

// /**
//  * Custom hook to manage current user state and authentication.
//  * @returns Object containing user, token, logout function, and query state.
//  */
// export const useGetMe = () => {
//   const { token, user, logout, setAuth } = useAuthStore();

//   const query = useQuery<IUser, Error>({
//     queryKey: ["me"],
//     queryFn: getMeService,
//     enabled: !!token, // Only run if token exists
//     ...queryOptions,
//   });

//   useEffect(() => {
//     // Sync user data with store
//     if (query.data && token && query.data !== user) {
//       setAuth(token, query.data);
//     }
//     // Handle unauthorized/forbidden errors
//     if (query.error?.message.match(/401|403/)) {
//       logout();
//     }
//   }, [query.data, query.error, token, user, setAuth, logout]);

//   return {
//     token,
//     user,
//     logout,
//     ...query,
//   };
// };

// /**
//  * Custom hook to update the current user's profile.
//  * @returns A mutation object for updating user data.
//  */
// export const useUpdateMe = () => {
//   const { setAuth, token } = useAuthStore();

//   return useMutation<IUser, Error, IUpdateMe>({
//     mutationKey: ["update-me"],
//     mutationFn: updateMeService,
//     ...mutationOptions,
//     onSuccess: (data) => {
//       if (token) setAuth(token, data); // Update store with new user data
//       toast.success("Profile updated successfully");
//     },
//     onError: (error) => {
//       toast.error(`Failed to update profile: ${error.message}`);
//     },
//   });
// };


// // export const useDeleteMe = () => {
// //   const { setAuth } = useAuthStore();
  
// //   re
// // }