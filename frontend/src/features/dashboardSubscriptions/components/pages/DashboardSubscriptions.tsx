"use client";

import React, { useState } from 'react'
import SubscriptionsTemplate from '../templates/SubscriptionsTemplate'
import { useGetAllSubscription, useUpdateSubscription } from '../../hooks/useSubscriptions';

export default function DashboardSubscriptions() {
  const [page, setPage] = useState(1);
  const [planType, setPlanType] = useState<string>('all');

  const { data } = useGetAllSubscription(page, planType === 'all' ? undefined : planType);
  const updateSubscription = useUpdateSubscription();
  
  return (
    <div className='py-10 px-6'>
      {data && 
      <SubscriptionsTemplate data={data} updateSubscription={updateSubscription.mutate} page={page} setPage={setPage} setPlanType={setPlanType}/>
      }
    </div>
  )
}
