'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useGetAllUsers } from '../../hooks/useUsers';
import Pagination from '@/features/mainComponents/Pagination';
import UsersTable from '../organisms/UsersTable';
import FilterAndSearchUser from '../organisms/Filter&SearchUser';

const UserTemplate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users from API using role & page
  const { data, isLoading } = useGetAllUsers(currentPage, filterRole === "all" ? undefined: filterRole)

  // Reset to page 1 when role changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole]);

  const users = data?.data.users ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / 10 );


  // Apply client-side search
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Users</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Filter & Search */}
        <FilterAndSearchUser searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterRole={setFilterRole}/>

        {/* Table */}
        <UsersTable isLoading={isLoading} filteredUsers={filteredUsers}/>

        {/* Pagination */}
        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>

      </CardContent>
    </Card>
  );
};

export default UserTemplate;
