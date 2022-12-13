import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import { Account } from '@/spa/account/account.types';

export const accountKeys = {
  all: () => ['accountService'] as const,
  account: () => [...accountKeys.all(), 'account'] as const,
};

export const useAccount = (
  config: UseQueryOptions<
    Account,
    AxiosError,
    Account,
    InferQueryKey<typeof accountKeys.account>
  > = {}
) => {
  const { i18n } = useTranslation();
  const { data: account, ...rest } = useQuery(
    accountKeys.account(),
    (): Promise<Account> =>
      Axios.get('/account/' + localStorage.getItem('authToken')),
    {
      onSuccess: (data) => {
        i18n.changeLanguage(data?.langKey);

        if (config?.onSuccess) {
          config?.onSuccess(data);
        }
      },
      ...config,
    }
  );
  const user = {
    ...account,
    authorities: account?.roles?.map((authority: TODO) => authority?.role),
  };

  const isAdmin = !!user?.authorities?.includes('admin');
  const isChef = !!user?.authorities?.includes('ROLE_CHEF');
  const isEmployee = !!user?.authorities?.includes('ROLE_EMPLOYEE');
  return { account: user, isAdmin, isChef, isEmployee, ...rest };
};

type AccountError = {
  title: string;
  errorKey: 'userexists' | 'emailexists';
};

export const useCreateAccount = (
  config: UseMutationOptions<
    Account,
    AxiosError<AccountError>,
    Pick<Account, 'username' | 'email'> & {
      password: string;
      speciality: string;
      username: string;
    }
  > = {}
) => {
  return useMutation(
    ({ username, email, password, speciality }): Promise<Account> =>
      Axios.post('/register', {
        username,
        email,
        password,
        role: [speciality],
        speciality,
      }),
    {
      ...config,
    }
  );
};

type UseActiveAccountVariables = {
  key: string;
};

export const useActivateAccount = (
  config: UseMutationOptions<
    void,
    AxiosError<any>,
    UseActiveAccountVariables
  > = {}
) => {
  return useMutation(
    ({ key }): Promise<void> => Axios.get(`/activate?key=${key}`),
    {
      ...config,
    }
  );
};

export const useUpdateAccount = (
  config: UseMutationOptions<Account, AxiosError<any>, Account> = {}
) => {
  const { i18n } = useTranslation();
  return useMutation(
    (account): Promise<Account> => Axios.post('/account', account),
    {
      onMutate: (data) => {
        i18n.changeLanguage(data?.langKey);

        if (config?.onMutate) {
          config.onMutate(data);
        }
      },
      ...config,
    }
  );
};

export const useResetPasswordInit = (
  config: UseMutationOptions<void, AxiosError<any>, string> = {}
) => {
  return useMutation(
    (email): Promise<void> =>
      Axios.post('/account/reset-password/init', email, {
        headers: { 'Content-Type': 'text/plain' },
      }),
    {
      ...config,
    }
  );
};

type UseResetPasswordFinishVariables = {
  key: string;
  newPassword: string;
};

export const useResetPasswordFinish = (
  config: UseMutationOptions<
    void,
    AxiosError<any>,
    UseResetPasswordFinishVariables
  > = {}
) => {
  return useMutation(
    (payload): Promise<void> =>
      Axios.post('/account/reset-password/finish', payload),
    {
      ...config,
    }
  );
};

export const useUpdatePassword = (
  config: UseMutationOptions<
    void,
    AxiosError<any>,
    { currentPassword: string; newPassword: string }
  > = {}
) => {
  return useMutation(
    (payload): Promise<void> => Axios.post('/account/change-password', payload),
    {
      ...config,
    }
  );
};
