import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { Dispatch, SetStateAction } from 'react';

type FilterSubscriptionProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setPlanType: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export default function FilterSubscription({searchTerm, setSearchTerm, setPlanType, setPage}: FilterSubscriptionProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
    <Input
      placeholder="Search by User ID..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full md:w-1/3"
    />

    <Select
      onValueChange={(value) => {
        setPlanType(value);
        setPage(1);
      }}
      defaultValue="all"
    >
      <SelectTrigger className="w-full md:w-1/4">
        <SelectValue placeholder="Filter by Plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Plans</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="quarterly">Quarterly</SelectItem>
        <SelectItem value="yearly">Yearly</SelectItem>
      </SelectContent>
    </Select>
  </div>
  )
}
