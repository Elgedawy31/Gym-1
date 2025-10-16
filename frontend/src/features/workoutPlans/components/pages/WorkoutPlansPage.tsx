"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/authStore';
import { useGetAllWorkoutPlans } from '@/features/workoutPlans/hooks/useWorkoutPlan';
import { WorkoutPlan } from '@/features/workoutPlans/types';
import { useSubscribeToWorkoutPlan } from '@/features/workoutPlans/hooks/useWorkoutPlan';

export default function WorkoutPlanPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Default items per page

  // Fetch all workout plans with pagination
const { data: workoutPlansData, isLoading: isLoadingPlans, isError: plansError } = useGetAllWorkoutPlans(page, limit);

  const { mutate: subscribeToPlan } = useSubscribeToWorkoutPlan();

  const plans = workoutPlansData?.data?.workoutPlans || [];
  const totalPages = workoutPlansData?.total
    ? Math.ceil(workoutPlansData.total / limit)
    : 1;

  if (isLoadingPlans) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-destructive">Failed to load workout plans</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">All Workout Plans</CardTitle>
            </div>
            <p className="text-muted-foreground mt-2">
              Browse all available workout plans and subscribe to start your fitness journey
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Pagination Controls - Top */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Items per page:</span>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1); // Reset to first page when limit changes
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Workout Plans */}
              <div className="grid gap-6">
                {plans.length > 0 ? (
                  plans.map((plan: WorkoutPlan) => (
                    <Card key={plan._id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-xl">{plan.title}</h3>
                            <Badge variant="secondary">
                              {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <span>• Duration: {plan.duration} weeks</span>
                            <span>• Subscribed: {plan.subscribedCount} users</span>
                            <span>• Created: {new Date(plan.createdAt).toLocaleDateString('en-US')}</span>
                            <span>• Trainer: {plan.trainerId?.name || 'Unknown'}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Exercises:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {plan.exercises.map((exercise, index) => (
                                <li key={index}>
                                  {exercise.name} - {exercise.sets} sets x {exercise.reps} reps,{' '}
                                  {exercise.rest} rest
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                              <Link href={`/workout-plan/details/${plan.id}`}>View Details</Link>
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

              {/* Pagination Controls - Bottom */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Items per page:</span>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1); // Reset to first page when limit changes
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}