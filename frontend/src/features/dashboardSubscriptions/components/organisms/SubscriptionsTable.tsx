"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ISubscription } from '@/features/subscription/types';
import dayjs from 'dayjs';

import { Dispatch, SetStateAction } from 'react';
import { Subscriptions } from '../../types';
import toast from 'react-hot-toast';

interface SubscriptionsTableProps {
  filtered: Subscriptions[];
  updateSubscription: (params: { subId: string; planType?: ISubscription['planType']; status?: ISubscription['status'] }) => void;
  isTrainer?: boolean
}

export default function SubscriptionsTable({filtered, updateSubscription, isTrainer}: SubscriptionsTableProps) {
  console.log(filtered);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 font-medium';
      case 'expired':
        return 'text-yellow-600 font-medium';
      case 'canceled':
        return 'text-red-600 font-medium';
      default:
        return 'text-muted-foreground';
    }
  };
  return (
    <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Name</TableHead>
          {isTrainer &&
          <TableHead>Trainer</TableHead>
          }
          <TableHead>Plan Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filtered.length ? (
          filtered.map((sub) => (
            <TableRow key={sub._id}>
              <TableCell>#{sub.userId._id.slice(0,4)}</TableCell>
              <TableCell>{sub.userId.name}</TableCell>
              {isTrainer &&
              <TableCell>{sub.trainerId?.name}</TableCell>
              }

              {/* Plan Select */}
              <TableCell>
                <Select
                  defaultValue={sub.planType}
                  onValueChange={(val) => 
                    updateSubscription({ subId: sub._id, planType: val as ISubscription['planType'] })
                    
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Status Select */}
              <TableCell>
                <Select
                  defaultValue={sub.status}
                  onValueChange={(val) =>
                    updateSubscription({ subId: sub._id, status: val as ISubscription['status'] })

                  }
                >
                  <SelectTrigger className={`w-[130px] ${getStatusColor(sub.status)}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell>{dayjs(sub.startDate).format("DD/MM/YYYY")}</TableCell>
              <TableCell>{dayjs(sub.endDate).format("DD/MM/YYYY")}</TableCell>

              {/* No explicit Update button; updates happen on change */}
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No subscriptions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
  )
}
