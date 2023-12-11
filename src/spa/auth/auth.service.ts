import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';

import { useAuthContext } from '@/spa/auth/AuthContext';

export const useLogin = (
  config: UseMutationOptions<
    { user_id: string },
    AxiosError<any>,
    { username: string; password: string }
  > = {}
) => {
  const { updateToken } = useAuthContext();
  return useMutation(
    ({ username, password }) => Axios.post('/login', { username, password }),
    {
      ...config,
      onSuccess: (data, ...rest) => {
        console.log(data);
        updateToken(data.user_id);
        if (config.onSuccess) {
          config.onSuccess(data, ...rest);
        }
      },
    }
  );
};
