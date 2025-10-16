import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WorkoutPlan, WorkoutPlanRequest, WorkoutPlansResponse } from "../types";
import { createWorkoutPlanService, deleteWorkoutPlanServiceService, getAllWorkoutPlansService, getWorkoutPlanByIdService, getWorkoutPlansByTrainerService, subscribeToWorkoutPlanService, updateWorkoutPlanService } from "../service/workoutPlanService";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useWorkoutPlanStore } from "../store/workoutPlanStore";


export const useCreateWorkoutPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkoutPlan, Error, WorkoutPlanRequest>({
    mutationKey: ["workoutPlans"],
    mutationFn: async (workoutPlanData) => {
      return await createWorkoutPlanService(workoutPlanData);
    },
    onSuccess: () => {
      toast.success("Workout plan created successfully");
      queryClient.invalidateQueries({ queryKey: ["workoutPlans"] });
    },
    onError: () => {
      toast.error("Failed to create workout plan");
    },
  });
};

export const useUpdateWorkoutPlan = () => {
  const queryClient = useQueryClient();
  return useMutation<WorkoutPlan, Error, {workoutPlanId: string, workoutPlan: WorkoutPlan}>({
    mutationFn: async ({workoutPlanId, workoutPlan}) => {
      return await updateWorkoutPlanService(workoutPlanId, workoutPlan);
    },
    onSuccess: () => {
      toast.success("Workout plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workoutPlans"] });
    },
    onError: () => {
      toast.error("Failed to update workout plan");
    },
  });
}

export const useDeleteWorkoutPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workoutPlanId: string) => {
      return await deleteWorkoutPlanServiceService(workoutPlanId);
    },
    onSuccess: () => {
      toast.success("Workout plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["workoutPlans"] });
    },
    onError: () => {
      toast.error("Failed to delete workout plan");
    },
  });
}

export const useGetAllWorkoutPlans = (page: number, limit: number) => {
  const queryClient = useQueryClient();
  const { setWorkoutPlans } = useWorkoutPlanStore();

  const { data, error, isError, isSuccess, ...query } = useQuery({
    queryKey: ["workoutPlans", page, limit],
    queryFn: () => getAllWorkoutPlansService(page, limit),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setWorkoutPlans(data.data.workoutPlans);
      queryClient.invalidateQueries({ queryKey: ["workoutPlans"] });
    }
  }, [isSuccess, data, setWorkoutPlans]);

  useEffect(() => {
    if (isError && error) {
      toast.error("Failed to get all workout plans");
    }
  }, [isError, error]);

  return { data, error, isError, isSuccess, ...query };
};

export const useGetWorkoutPlanById = (id: string) => {
  return useQuery<WorkoutPlan, Error>({
    queryKey: ["workoutPlan", id],
    queryFn: async () => await getWorkoutPlanByIdService(id),
    enabled: !!id,
  });
};
export const useGetWorkoutPlansByTrainer = () => {
  return useMutation<WorkoutPlansResponse, Error, string>({
    mutationFn: async (trainerId: string) => getWorkoutPlansByTrainerService(trainerId),
    onError: () => {
      toast.error("Failed to get workout plans by trainer");
    },
  });
};

export const useSubscribeToWorkoutPlan = () => {
  return useMutation<WorkoutPlan, any, string>({
    mutationFn: (workoutPlanId: string) =>
      subscribeToWorkoutPlanService(workoutPlanId),
    onSuccess: () => {
      toast.success("Successfully subscribed to workout plan");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to subscribe to workout plan";
      toast.error(message);
    },
  });
};

