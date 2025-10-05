"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import type { PlanType } from '../../types';
import { toast } from 'react-hot-toast';
import { useCreateSubscription, useGetMySubscription } from '../../hooks/useSubscription';

const plans: { 
  key: PlanType; 
  name: string; 
  price: string; 
  features: string[] 
}[] = [
  { 
    key: "monthly", 
    name: "Monthly Plan", 
    price: "$9 / month", 
    features: ["Full Gym Access", "1 Class / week", "Free Locker", " "] 
  },
  { 
    key: "quarterly", 
    name: "Quarterly Plan", 
    price: "$25 / 3 months", 
    features: ["Full Gym Access", "3 Classes / week", "Free Locker"," "] 
  },
  { 
    key: "yearly", 
    name: "Yearly Premium", 
    price: "$90 / year", 
    features: ["All Access", "Unlimited Classes", "Personal Trainer Support", "Free Locker"] 
  },
];


export default function SubscriptionPage() {
  // Fetch current subscription using the useGetMySubscription hook
  const { data: subscription, isLoading: isSubscriptionLoading, isError: isSubscriptionError, error: subscriptionError } = useGetMySubscription();

  // Use the useCreateSubscription hook for creating a new subscription
  const { mutate, isPending: isCreating, data: createdSubscription, isError: isCreateError, error: createError } = useCreateSubscription();

  let dis;
  if(subscription){
     dis = subscription?._id === subscription?.id;
  }

  // Handle subscription creation
  const handleSubscribe = (plan: PlanType) => {
    mutate(plan, {
      onSuccess: (data) => {
        toast.success(`Subscribed to ${data.planType} plan`);
      },
      onError: (error) => {
        toast.error(`Your Subscribed already`);
      },
    });
  };

  // Handle error state for subscription fetching
  if (isSubscriptionError) {
    toast.error(`Failed to load subscription: ${subscriptionError?.message || 'Unknown error'}`);
  }

  return (
    <div className="min-h-[89vh] bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground">Choose Your Plan</h1>
          <p className="text-muted-foreground mt-2">Select a subscription that fits your fitness goals.</p>
        </div>

        {isSubscriptionLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading plans...
          </div>
        )}

        {!isSubscriptionLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isActive = subscription?.planType === plan.key && subscription?.status === 'active';
              return (
                <Card key={plan.key} className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {isActive && <Badge variant="secondary">Active</Badge>}
                    </div>
                    <div className="text-2xl font-bold text-foreground">{plan.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center text-sm text-muted-foreground">
                          <Check className="w-4 h-4 mr-2 text-primary" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      disabled={isCreating || isActive || isSubscriptionLoading || dis}
                      onClick={() => handleSubscribe(plan.key)}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Subscribing...
                        </>
                      ) : isActive ? (
                        'Current Plan'
                      ) : (
                        'Choose Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}