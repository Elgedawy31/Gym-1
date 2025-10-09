import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

type FilterAndSearchUserProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setFilterRole: (value: string) => void;
};

export default function FilterAndSearchUser({searchTerm, setSearchTerm, setFilterRole}: FilterAndSearchUserProps) {
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
          onValueChange={(val) => setFilterRole(val)}
          defaultValue="all"
        >
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="trainer">Trainer</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
