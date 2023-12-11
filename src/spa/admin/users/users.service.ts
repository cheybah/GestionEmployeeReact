import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';

import { User, UserList } from '@/spa/admin/users/users.types';

type UserMutateError = {
  title: string;
  errorKey: 'userexists' | 'emailexists';
};

const usersKeys = {
  all: () => ['usersService'] as const,
  users: ({ page, size }: { page?: number; size?: number }) =>
    [...usersKeys.all(), 'users', { page, size }] as const,
  user: ({ login }: { login?: string }) =>
    [...usersKeys.all(), 'user', { login }] as const,
};

export const useUserList = (
  { page = 0, size = 10 } = {},
  config: UseQueryOptions<
    TODO,
    AxiosError,
    TODO,
    InferQueryKey<typeof usersKeys.users>
  > = {}
) => {
  const result = useQuery(
    usersKeys.users({ page, size }),
    (): Promise<UserList> => Axios.get('/users'),
    config
  );

  return {
    users: result.data ?? [],
  };
};

export const useUser = (
  userLogin?: string,
  config: UseQueryOptions<
    TODO,
    AxiosError,
    TODO,
    InferQueryKey<typeof usersKeys.user>
  > = {}
) => {
  const result = useQuery(
    usersKeys.user({ login: userLogin }),
    (): Promise<User> => Axios.get(`/account/${userLogin}`),
    {
      enabled: !!userLogin,
      ...config,
    }
  );

  return {
    user: result.data,
    ...result,
  };
};

export const useUserUpdate = (
  config: UseMutationOptions<User, AxiosError<UserMutateError>, User> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation((payload) => Axios.put('/users/' + payload?.id), {
    ...config,
    onSuccess: (data, payload: TODO, ...rest) => {
      queryClient.cancelQueries([...usersKeys.all(), 'users']);
      queryClient
        .getQueryCache()
        .findAll([...usersKeys.all(), 'users'])
        .forEach(({ queryKey }) => {
          queryClient.setQueryData<UserList | undefined>(
            queryKey,
            (cachedData) => {
              if (!cachedData) return;
              return {
                ...cachedData,
                content: (cachedData.content || []).map((user) =>
                  user.id === data.id ? data : user
                ),
              };
            }
          );
        });
      queryClient.invalidateQueries([...usersKeys.all(), 'users']);
      queryClient.invalidateQueries(usersKeys.user({ login: payload.user_id }));
      if (config.onSuccess) {
        config.onSuccess(data, payload, ...rest);
      }
    },
  });
};

export const useUserCreate = (
  config: UseMutationOptions<TODO, AxiosError<UserMutateError>, TODO> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ username, email, password, role, speciality }) =>
      Axios.post('/users', {
        username,
        email,
        password,
        role,
        speciality,
      }),
    {
      ...config,
      onSuccess: (...args) => {
        queryClient.invalidateQueries([...usersKeys.all(), 'users']);
        config?.onSuccess?.(...args);
      },
    }
  );
};

type UserWithLoginOnly = Pick<User, 'username'>;

export const useUserRemove = (
  config: UseMutationOptions<void, unknown, UserWithLoginOnly> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    (user: TODO): Promise<void> => Axios.delete(`/users/${user.user_id}`),
    {
      ...config,
      onSuccess: (...args) => {
        queryClient.invalidateQueries([...usersKeys.all(), 'users']);
        config?.onSuccess?.(...args);
      },
    }
  );
};
