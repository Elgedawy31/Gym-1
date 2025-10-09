import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IUser } from '@/features/auth/types/types';
import dayjs from 'dayjs';
import { Trash2, View } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface UserTableProp {
  filteredUsers: IUser[],
  isLoading: boolean,
}

export default function UsersTable({isLoading, filteredUsers}: UserTableProp) {
  return (
    <div>        <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profile</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              Loading...
            </TableCell>
          </TableRow>
        ) : filteredUsers.length ? (
          filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  {user.profilePicture ? (
                    <Image src={user.profilePicture} alt={user.name} fill className="object-cover" />
                  ) : (
                    <div className="bg-muted w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                      N/A
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>{dayjs(user.createdAt).format()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {user.role === "trainer" &&
                    <Link href={`/profile/${user._id}`}>
                      <Button variant="outline" size="icon">
                        <View className="h-4 w-4" />
                      </Button>
                    </Link>
                  }
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div></div>
  )
}
