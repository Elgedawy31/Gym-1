'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { useGetAllOrders, useUpdateStatus } from '../../hooks/useDashboardOrders';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import OrdersTable from '../organisms/OrdersTable';
import Pagination from '@/features/mainComponents/Pagination';
import FilterOrders from '../organisms/FilterOrders';

export default function OrdersTemplate() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useGetAllOrders(page, status === "all"? undefined: status);
  const updateStatus = useUpdateStatus();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus });
    } catch {
      toast.error('Failed to update status');
    }
  };

  const orders = data?.data?.orders || [];
  const total = data?.total || 0;
  const limit = data?.limit || 10;

  const totalPages = Math.ceil(total / limit);

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>Orders</CardTitle>

        <FilterOrders setStatus={setStatus}/>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : (
          <OrdersTable orders={orders} handleStatusChange={handleStatusChange}/>
        )}

        {/* Pagination */}
        <Pagination totalPages={totalPages} currentPage={page} setCurrentPage={setPage}/>

      </CardContent>
    </Card>
  );
}
