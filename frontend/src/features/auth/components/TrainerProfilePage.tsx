"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  Activity,
  Dumbbell,
  ShoppingBag
} from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/authStore';
import { getTrainer } from '@/features/home/hooks/useHome';
import { getWorkoutPlansByTrainerService } from '@/features/workoutPlans/service/workoutPlanService';
import { WorkoutPlansResponse, WorkoutPlan } from '@/features/workoutPlans/types';
import { useSubscribeToWorkoutPlan } from '@/features/workoutPlans/hooks/useWorkoutPlan';
import { TrainerProfileSkeleton } from './TrainerProfileSkeleton';
import { Trainer } from '@/features/home/types';
import { useCreateTrainerSubscription, useGetMyTrainerSubscription } from '@/features/trainer subscription/hooks/useTrainerSubscription';

export default function TrainerProfilePage() {
  const { trainerId } = useParams<{ trainerId: string }>();
  const { user } = useAuthStore();
    const { mutate } = useCreateTrainerSubscription()

  // trainer data
  const {
    data: trainer,
    isLoading: isLoadingTrainer,
    error: trainerError
  } = useQuery<Trainer>({
    queryKey: ['trainer', trainerId],
    queryFn: async () => {
      if (!trainerId) throw new Error('Invalid trainer id');
      return await getTrainer(trainerId as string);
    },
    enabled: !!trainerId
  });

  // trainer's plans
  const {
    data: workoutPlansData,
    isLoading: isLoadingPlans,
  } = useQuery<WorkoutPlansResponse>({
    queryKey: ['trainerWorkoutPlans', trainerId],
    queryFn: async () => {
      if (!trainerId) throw new Error('Invalid trainer id');
      return await getWorkoutPlansByTrainerService(trainerId as string);
    },
    enabled: !!trainerId
  });

  const { mutate: subscribeToPlan } = useSubscribeToWorkoutPlan();
  const {data: myTrainers} = useGetMyTrainerSubscription()

  const check = myTrainers?.find((trainer) => trainer.trainerId === trainerId)

  if (isLoadingTrainer) return <TrainerProfileSkeleton />;

  if (trainerError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-destructive">Failed to load trainer profile</p>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-muted-foreground">Trainer not found</p>
      </div>
    );
  }

  const plans = workoutPlansData?.data?.workoutPlans || [];

  const handleHeaderSubscribe = () => {
    if (!trainerId) {
      toast.error('Trainer ID is missing.');
      return;
    }
    const data = {
      trainerId: trainerId as string,
      planType: "quarterly" as const,
    };
    mutate(data)
  };

  return (
    <div className="min-h-screen mb-6 bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <Avatar className="w-32 h-32 mx-auto border-4 border-primary-foreground/30 shadow-2xl">
                <AvatarImage
                  src={trainer.profilePicture}
                  alt={trainer.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
                  {trainer.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center justify-center gap-4">
              <h1 className="text-4xl font-bold">{trainer.name}</h1>

              {/* role & subscribe button */}
              <div className="flex items-center gap-2">
                <Badge variant="default" className="px-3 py-2 text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {trainer.role.charAt(0).toUpperCase() + trainer.role.slice(1)}
                </Badge>
                {!check &&
                  <Button
                  variant="secondary"
                  onClick={() => handleHeaderSubscribe()}
                  className="flex items-center gap-2"
                  >
                    Subscribe to Trainer
                  </Button>
                }
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium text-background">
                {trainer.gender === 'male' ? '♂ Male' : trainer.gender === 'female' ? '♀ Female' : '⚧ Other'}
              </Badge>

              {trainer.createdAt && (
                <p className="text-primary-foreground/80 text-lg">
                  Member since {new Date(trainer.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            <p className="text-primary-foreground/80 text-lg mt-2">Explore the trainer and available workout plans</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Trainer Overview</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{trainer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{trainer.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">{trainer.gender.charAt(0).toUpperCase() + trainer.gender.slice(1)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Workout Plans</p>
                    <p className="font-medium text-foreground">{plans.length} plan{plans.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => window.scrollTo({ top: document.getElementById('workout-plans')?.offsetTop, behavior: 'smooth' })}
                  className="w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    View Workout Plans
                  </span>
                </Button>

                <Link href="/workout-plan" className="w-full">
                  <Button variant="ghost" className="w-full">Browse All Plans</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Workout Plans */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Workout Plans</CardTitle>
                </div>
              </CardHeader>

              <CardContent id="workout-plans">
                <div className="grid gap-4">
                  {isLoadingPlans ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : plans.length > 0 ? (
                    plans.map((plan: WorkoutPlan) => (
                      <Card key={plan._id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-lg">{plan.title}</h3>
                              <Badge variant="secondary">{plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <span>• Duration: {plan.duration} weeks</span>
                              <span>• Price: ${plan.price}</span>
                              <span>• Subscribed: {plan.subscribedCount} users</span>
                              <span>• Created: {new Date(plan.createdAt).toLocaleDateString('en-US')}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Exercises:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {plan.exercises.map((exercise, index) => (
                                  <li key={index}>
                                    {exercise.name} - {exercise.sets} sets x {exercise.reps} reps, {exercise.rest} rest
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                asChild
                              >
                                <Link href={`/workout-plan/${plan.id}`}>
                                  View Details
                                </Link>
                              </Button>
                              <Button
                                variant="default"
                                disabled={!user}
                                onClick={async () => {
                                  if (!user) {
                                    toast.error('Please log in to subscribe to a plan');
                                    return;
                                  }
                                  try {
                                    await subscribeToPlan(plan._id);
                                    toast.success('Successfully subscribed to the workout plan');
                                  } catch (err) {
                                    console.error('Subscribe error:', err);
                                    toast.error('Failed to subscribe to the plan');
                                  }
                                }}
                              >
                                Subscribe
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-6">No workout plans available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}