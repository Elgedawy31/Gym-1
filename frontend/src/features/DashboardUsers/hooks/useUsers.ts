import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../services/userService';
import { UsersResponse } from '../types/userTypes';

export function useGetAllUsers(page: number, role?: string) {
  return useQuery<UsersResponse>({
    queryKey: ['dashboard-users', { page, role }],
    queryFn: () => getAllUsers(page, role),
    placeholderData: (prev) => prev,
    staleTime: 10_000,
  });
}


