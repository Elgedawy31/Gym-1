"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dumbbell, Calendar, DollarSign, Users } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/authStore';
import { useGetWorkoutPlanById } from '@/features/workoutPlans/hooks/useWorkoutPlan';

export default function WorkoutPlanDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  
  
  // Fetch workout plan by ID
  const {data: workoutPlan, isLoading: isLoadingPlan, isError: planError} = useGetWorkoutPlanById(id)

  if (isLoadingPlan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (planError || !workoutPlan) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-destructive">Failed to load workout plan details</p>
      </div>
    );
  }

  return (
    <div className="max-h-[91vh] overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{workoutPlan.title}</CardTitle>
            </div>
            <p className="text-muted-foreground mt-2">{workoutPlan.description}</p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Plan Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-foreground">${workoutPlan.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{workoutPlan.duration} weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Dumbbell className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium text-foreground">
                    {workoutPlan.level.charAt(0).toUpperCase() + workoutPlan.level.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Subscribed Users</p>
                  <p className="font-medium text-foreground">{workoutPlan.subscribedCount} users</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {new Date(workoutPlan.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
              {workoutPlan.updatedAt && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium text-foreground">
                      {new Date(workoutPlan.updatedAt).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Trainer Information */}
            {workoutPlan.trainerId && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Trainer</h3>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={workoutPlan.trainerId.profilePicture || ''}
                      alt={workoutPlan.trainerId.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">
                      {workoutPlan.trainerId.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{workoutPlan.trainerId.name}</p>
                    <p className="text-sm text-muted-foreground">{workoutPlan.trainerId.email}</p>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href={`/profile/${workoutPlan.trainerId._id}`}>
                        View Trainer Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Exercises */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Exercises</h3>
              {workoutPlan.exercises.length > 0 ? (
                <ul className="space-y-3">
                  {workoutPlan.exercises.map((exercise, index) => (
                    <li key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets} sets x {exercise.reps} reps, {exercise.rest} rest
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No exercises listed for this plan</p>
              )}
            </div>

            {/* Subscribed Users */}
            {workoutPlan.usersSubscribed.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Subscribed Users</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {workoutPlan.usersSubscribed.map((subscriber) => (
                    <div key={subscriber._id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm bg-secondary text-secondary-foreground">
                          {subscriber.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{subscriber.name}</p>
                        <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {/* <div className="flex justify-end gap-2">
              <Button
                variant="default"
                disabled={!user}
                onClick={async () => {
                  if (!user) {
                    toast.error('Please log in to subscribe to a plan');
                    return;
                  }
                  try {
                    await subscribeToPlan(workoutPlan._id);
                    toast.success('Successfully subscribed to the workout plan');
                  } catch (err) {
                    console.error('Subscribe error:', err);
                    toast.error('Failed to subscribe to the plan');
                  }
                }}
              >
                Subscribe
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}