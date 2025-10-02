"use client";

// pages/dashboard.tsx
import { useAuthStore } from "@/features/auth/store/authStore";

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1>Welcome, {user?.name || "User"}!</h1>
      <button onClick={() => useAuthStore.getState().logout()}>Logout</button>
    </div>
  );
}