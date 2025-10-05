import clientAxios from "@/lib/axios/clientAxios";
import { WorkoutPlan, WorkoutPlansResponse } from "../types";
import { API_CONFIG } from "@/config/api";
import { AxiosResponse } from "axios";

export const createWorkoutPlanService = async (workoutPlan: WorkoutPlan) : Promise<WorkoutPlan> => {
  try {
    const response: AxiosResponse<{ data: { workoutPlan: WorkoutPlan } }> = await clientAxios.post(
      API_CONFIG.ENDPOINTS.WORKOUT_PLANS.CREATE_WORKOUT_PLAN,
      workoutPlan
    );

    return response.data.data.workoutPlan;
  } catch (error) {
    console.error("Error creating workout plan:", error);
    throw new Error("Failed to create workout plan. Please try again.");
  }
}

export const updateWorkoutPlanService = async (workoutPlanId: string, workoutPlan: WorkoutPlan) : Promise<WorkoutPlan> => {
  try {
    const response: AxiosResponse<{ data: { workoutPlan: WorkoutPlan } }> = await clientAxios.put(API_CONFIG.ENDPOINTS.WORKOUT_PLANS.UPDATE_WORKOUT_PLAN(workoutPlanId), workoutPlan);
    return response.data.data.workoutPlan;
  } catch (error) {
    console.error("Error updating workout plan:", error);
    throw new Error("Failed to update workout plan. Please try again.");
  }
}

export const deleteWorkoutPlanServiceService = async (workoutPlanId: string) : Promise<void> => {
  try {
    const response: AxiosResponse<void> = await clientAxios.delete(API_CONFIG.ENDPOINTS.WORKOUT_PLANS.DELETE_WORKOUT_PLAN(workoutPlanId));
  } catch (error) {
    console.error("Error deleting workout plan:", error);
    throw new Error("Failed to delete workout plan. Please try again.");
  }
}

export const getAllWorkoutPlansService = async (page: number) : Promise<WorkoutPlansResponse> => {
  try {
    const response: AxiosResponse<WorkoutPlansResponse> = await clientAxios.get(API_CONFIG.ENDPOINTS.WORKOUT_PLANS.GET_ALL_WORKOUT_PLANS(page));
    return response.data;
  } catch (error) {
    console.error("Error getting all workout plans:", error);
    throw new Error("Failed to get all workout plans. Please try again.");
  }
}

export const getWorkoutPlanByIdService = async (workoutPlanId: string) : Promise<WorkoutPlan> => {
  try { 
    const response: AxiosResponse<{ data: { workoutPlan: WorkoutPlan } }> = await clientAxios.get(API_CONFIG.ENDPOINTS.WORKOUT_PLANS.GET_WORKOUT_PLAN_BY_ID(workoutPlanId));
    return response.data.data.workoutPlan;
  } catch (error) {
    console.error("Error getting workout plan by id:", error);
    throw new Error("Failed to get workout plan by id. Please try again.");
  }
}

export const getWorkoutPlansByTrainerService = async (trainerId: string) : Promise<WorkoutPlansResponse> => {
  try {
    const response: AxiosResponse<WorkoutPlansResponse> = await clientAxios.get(API_CONFIG.ENDPOINTS.WORKOUT_PLANS.GET_WORKOUT_PLANS_BY_TRAINER(trainerId));
    return response.data;
  } catch (error) {
    console.error("Error getting workout plans by trainer:", error);
    throw new Error("Failed to get workout plans by trainer. Please try again.");
  }
}

export const subscribeToWorkoutPlanService = async (workoutPlanId: string) : Promise<WorkoutPlan> => {
  try {
    const response: AxiosResponse<{ data: { workoutPlan: WorkoutPlan } }> = await clientAxios.post(API_CONFIG.ENDPOINTS.WORKOUT_PLANS.SUBSCRIBE_TO_WORKOUT_PLAN(workoutPlanId));
    return response.data.data.workoutPlan;
  } catch (error) {
    console.error("Error subscribing to workout plan:", error);
    throw new Error("Failed to subscribe to workout plan. Please try again.");
  }
}