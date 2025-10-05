"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/auth/store/authStore';
import { TrainerProfileSkeleton } from './TrainerProfileSkeleton';
import { Trainer } from '../types/trainerTypes';
import { WorkoutPlan } from '@/features/workoutPlans/types';



export default function TrainerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const fetchWorkoutPlans = async () => {
    if (!id) return;
    setIsLoadingPlans(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout-plans/trainer/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workout plans');
      }
      const data = await response.json();
      setWorkoutPlans(data.data.workoutPlans);
    } catch (error) {
      console.error('Failed to load workout plans:', error);
      toast.error('Failed to load workout plans');
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    const loadTrainerData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trainer data');
        }
        const data = await response.json();
        setTrainer(data.data.user);
        
        // Load workout plans after trainer data is loaded
        await fetchWorkoutPlans();
      } catch (error) {
        console.error('Failed to load trainer data:', error);
        toast.error('Failed to load trainer profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadTrainerData();
    }
  }, [id]);

  if (isLoading) {
    return <TrainerProfileSkeleton />;
  }

  if (!trainer) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Trainer not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={trainer.profilePicture} alt={trainer.name} />
              <AvatarFallback>{trainer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{trainer.name}</CardTitle>
              <p className="text-sm text-gray-500">{trainer.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            if (value === 'workout-plans' && !isLoadingPlans && workoutPlans.length === 0) {
              fetchWorkoutPlans();
            }
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="workout-plans">Workout Plans</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input value={trainer.phoneNumber || 'Not provided'} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <Input value={trainer.gender} readOnly />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="workout-plans">
              <div className="grid gap-4">
                {isLoadingPlans ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : workoutPlans.length > 0 ? (
                  workoutPlans.map((plan) => (
                    <Card key={plan._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{plan.title}</h3>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                            <div className="flex gap-2 mt-2 text-sm">
                              {/* <span>{plan.difficulty}</span> */}
                              <span>•</span>
                              <span>{plan.duration} weeks</span>
                              <span>•</span>
                              <span>${plan.price}</span>
                            </div>
                          </div>
                          {/* <Button 
                            variant={plan.isSubscribed ? "secondary" : "default"} 
                            disabled={plan.isSubscribed || !user}
                            onClick={async () => {
                              try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainer-subscriptions`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    trainerId: id,
                                    planType: 'monthly',  // We could make this configurable
                                  }),
                                });

                                if (!response.ok) {
                                  throw new Error('Failed to subscribe');
                                }

                                toast.success('Successfully subscribed to the trainer');
                                await fetchWorkoutPlans();  // Refresh the workout plans to update subscription status
                              } catch (error) {
                                console.error('Error subscribing to trainer:', error);
                                toast.error('Failed to subscribe to trainer');
                              }
                            }}
                          >
                            {!user ? 'Login to Subscribe' : plan.isSubscribed ? 'Subscribed' : 'Subscribe'}
                          </Button> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No workout plans available</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
