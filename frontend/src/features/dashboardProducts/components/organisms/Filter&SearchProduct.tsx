import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react'

type FilterAndSearchProductProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setFilterType: (value: 'all' | 'men' | 'women' | 'general') => void;
  setCurrentPage: (page: number) => void;
};

export default function FilterAndSearchProduct({searchTerm, setSearchTerm, setFilterType, setCurrentPage}: FilterAndSearchProductProps) {
  return (
    <div>        
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3"
      />

      <Select
        onValueChange={(value) => {
          setFilterType(value as 'all' | 'men' | 'women' | 'general');
          setCurrentPage(1);
        }}
        defaultValue="all"
      >
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="men">Men</SelectItem>
          <SelectItem value="women">Women</SelectItem>
          <SelectItem value="general">General</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
  )
}
