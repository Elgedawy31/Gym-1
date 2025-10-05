import { create } from "zustand";
import { WorkoutPlan } from "../types";

interface WorkoutPlanStore {
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: (workoutPlans: WorkoutPlan[]) => void;
}

export const useWorkoutPlanStore = create<WorkoutPlanStore>((set) => ({
  workoutPlans: [],
  setWorkoutPlans: (workoutPlans) => set({ workoutPlans }),
}));