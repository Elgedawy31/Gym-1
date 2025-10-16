import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getAllUsers } from '../services/userService';
import { UsersResponse } from '../types/userTypes';

export function useGetAllUsers(page: number, role?: string) {
  return useQuery<UsersResponse>({
    queryKey: ['dashboard-users', { page, role }],
    queryFn: () => getAllUsers(page, role),
    placeholderData: (prev) => prev,
    staleTime: 10_000,
  });
}


export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      // Invalidate and refetch users after delete
      queryClient.invalidateQueries({ queryKey: ['dashboard-users'] });
    },
  });
}
