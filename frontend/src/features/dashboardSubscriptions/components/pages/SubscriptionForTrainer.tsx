"use client";

import { useState } from "react";
import { useGetAllTrainerSubscriptions, useUpdateTrainerSubscription } from "../../hooks/useSubscriptions";
import SubscriptionsTemplate from "../templates/SubscriptionsTemplate";

export default function SubscriptionForTrainer() {
  const [page, setPage] = useState(1);
  const [planType, setPlanType] = useState<string>('all');

  const { data } = useGetAllTrainerSubscriptions(page, planType === 'all' ? undefined : planType);
  const updateSubscription = useUpdateTrainerSubscription();

  // const isTrainer = true;
  
  return (
    <div className='py-10 px-6'>
      {data && 
      <SubscriptionsTemplate data={data} updateSubscription={updateSubscription.mutate} page={page} setPage={setPage} setPlanType={setPlanType} isTrainer/>
      }
    </div>
  )
}
