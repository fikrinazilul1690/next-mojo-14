'use client';
import NextImage from 'next/image';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { User } from '@/app/lib/definitions';
import { Chip } from '@nextui-org/chip';
import { Avatar } from '@nextui-org/avatar';
import { useUser } from '@/app/context/user-provider';
import { DeleteAdmin } from './admins-button';
import { useOptimistic } from 'react';
import { deleteAdmin } from '@/app/lib/actions';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Email', uid: 'email' },
  { name: 'Phone', uid: 'phone' },
  { name: 'Role', uid: 'role' },
  { name: '', uid: 'actions' },
];

export default function AdminsTableClient({ users }: { users: User[] }) {
  const [user] = useUser();
  const [optimisticListAdmin, updateOptimisticListAdmin] = useOptimistic(users);
  const handleDeleteAdmin = async (userId: string) => {
    updateOptimisticListAdmin((pendingState: User[]) =>
      pendingState.filter((user) => user.id !== userId)
    );
    await deleteAdmin(userId);
  };
  return (
    <Table aria-label='Products tabel'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={'center'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={optimisticListAdmin}>
        {(admin) => (
          <TableRow key={admin.id}>
            <TableCell>
              <div className='mb-2 flex gap-2 items-center'>
                <Avatar
                  ImgComponent={NextImage}
                  imgProps={{
                    width: 34,
                    height: 34,
                  }}
                  src={admin.profile_picture?.url}
                  name={admin.name}
                  showFallback
                />
                <p>{admin.name}</p>
              </div>
            </TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>{admin.phone}</TableCell>
            <TableCell>
              <Chip>{admin.role}</Chip>
            </TableCell>
            <TableCell>
              <div className='relative flex items-center gap-2'>
                {user?.role === 'owner' && user?.id !== admin.id ? (
                  <DeleteAdmin
                    user={admin}
                    deleteAction={async () => {
                      await handleDeleteAdmin(admin.id);
                    }}
                  />
                ) : null}
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
