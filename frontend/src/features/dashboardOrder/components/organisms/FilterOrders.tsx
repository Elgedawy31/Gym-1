import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

type FilterOrdersProps = {
  setStatus: (status: string | undefined) => void;
};

export default function FilterOrders({setStatus}: FilterOrdersProps) {
  return (
    <Select
    onValueChange={(val) => setStatus(val === 'all' ? undefined : val)}
    defaultValue="all"
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Filter by status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="confirmed">Confirmed</SelectItem>
      <SelectItem value="shipped">Shipped</SelectItem>
      <SelectItem value="delivered">Delivered</SelectItem>
      <SelectItem value="canceled">Canceled</SelectItem>
    </SelectContent>
  </Select>
  )
}
