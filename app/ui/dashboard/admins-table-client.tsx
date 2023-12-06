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
import { Admin } from '@/app/lib/definitions';
import { Chip } from '@nextui-org/chip';
import { Avatar } from '@nextui-org/avatar';
import { useUser } from '@/app/context/user-provider';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Email', uid: 'email' },
  { name: 'Phone', uid: 'phone' },
  { name: 'Role', uid: 'role' },
  // { name: '', uid: 'actions' },
];

export default function AdminsTableClient({ admins }: { admins: Admin[] }) {
  const [user] = useUser();
  return (
    <Table aria-label='Products tabel'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={'center'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={admins}>
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
            {/* <TableCell>
              <div className='relative flex items-center gap-2'>
                {user?.id !== admin.id ? <button>Delete</button> : null}
              </div>
            </TableCell> */}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
