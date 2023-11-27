'use client';
import React, { createContext, useOptimistic } from 'react';
import type { User } from '@/app/lib/definitions';

type UserRequest = {
  name?: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
  profile_picture?: {
    name: string;
    url: string;
    uploaded_at: string;
  };
};

const useUserState = (initalUser: User | null) =>
  useOptimistic<User | null>(initalUser);

export const UserContext = createContext<ReturnType<
  typeof useUserState
> | null>(null);

export const useUser = () => {
  const user = React.useContext(UserContext);
  if (!user) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return user;
};

const UserProvider = ({
  user: initialUser,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  const [user, updateUser] = useUserState(initialUser);

  return (
    <UserContext.Provider value={[user, updateUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
