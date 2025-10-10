'use client';

import { useState, useMemo, SetStateAction, Dispatch } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SubscriptionsTable from '../organisms/SubscriptionsTable';
import Pagination from '@/features/mainComponents/Pagination';
import FilterSubscription from '../organisms/FilterSubscription';
import { AllSubscriptionsResponse } from '../../types';
import { ISubscription } from '@/features/subscription/types';

interface SubscriptionsTemplateProps {
  data: AllSubscriptionsResponse;
  setPage: Dispatch<SetStateAction<number>>;
  setPlanType: Dispatch<SetStateAction<string>>;
  updateSubscription: (params: { subId: string; planType?: ISubscription['planType']; status?: ISubscription['status'] }) => void;
  page: number;
  isTrainer?: boolean;
}


export default function SubscriptionsTemplate({data, setPage, setPlanType, updateSubscription, page, isTrainer}: SubscriptionsTemplateProps) {

  const [searchTerm, setSearchTerm] = useState('');



  const subscriptions = data?.data?.subscriptions ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / (data?.limit ?? 1));

  const filtered = useMemo(() => {
    return subscriptions.filter((s) =>
      s.userId?._id?.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [subscriptions, searchTerm]);




  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Subscriptions</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <FilterSubscription searchTerm={searchTerm} setSearchTerm={setSearchTerm} setPage={setPage} setPlanType={setPlanType} /> 

        {/* Table */}
        <SubscriptionsTable filtered={filtered} updateSubscription={updateSubscription} isTrainer={isTrainer}/>

        {/* Pagination */}
        <Pagination totalPages={totalPages} currentPage={page} setCurrentPage={setPage}/>

      </CardContent>
    </Card>
  );
}
