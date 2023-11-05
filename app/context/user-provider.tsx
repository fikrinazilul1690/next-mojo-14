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
  useOptimistic<User | null, UserRequest>(
    initalUser,
    (state: User | null, req: UserRequest) => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        name: req?.name ?? state.name,
        phone: req?.phone ?? state.phone,
        gender: req?.gender ?? state.gender,
        birthdate: req?.birthdate ?? state.birthdate,
        profile_picture: req.profile_picture ?? state.profile_picture,
      };
    }
  );

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
