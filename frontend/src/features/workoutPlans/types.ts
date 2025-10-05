export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
}

export interface Trainer {
  _id: string;
  name: string;
  email: string;
}

export interface SubscribedUser {
  _id: string;
  name: string;
  email: string;
}



export interface WorkoutPlan {
  _id: string;
  id: string;
  trainerId: Trainer | null;
  title: string;
  description: string;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  exercises: Exercise[];
  usersSubscribed: SubscribedUser[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  subscribedCount: number;
}


export interface WorkoutPlansResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  data: {
    workoutPlans: WorkoutPlan[];
  };
}


export interface WorkoutPlanRequest {
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  title: string;
  description: string;
  exercises: Exercise[];
}
