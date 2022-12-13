import React from 'react';

import { Stack } from '@chakra-ui/react';
import {
  isEmail,
  isMaxLength,
  isMinLength,
  isPattern,
} from '@formiz/validations';
import { useTranslation } from 'react-i18next';

import { FieldCheckboxes } from '@/components/FieldCheckboxes';
import { FieldInput } from '@/components/FieldInput';
import { FieldSelect } from '@/components/FieldSelect';

const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
};

export const UserForm = () => {
  const { t } = useTranslation(['common', 'users']);
  const roles = [
    { label: 'Employee', value: 'ROLE_EMPLOYEE' },
    { label: 'Chef', value: 'ROLE_CHEF' },
  ];
  const authorities = Object.values(AUTHORITIES).map((value) => ({ value }));
  return (
    <Stack
      direction="column"
      borderRadius="lg"
      spacing="6"
      shadow="md"
      bg="white"
      _dark={{ bg: 'gray.900' }}
      p="6"
    >
      <FieldInput
        name="username"
        label={t('users:data.login.label')}
        required={t('users:data.login.required') as string}
        validations={[
          {
            rule: isMinLength(2),
            message: t('users:data.login.tooShort', { min: 2 }),
          },
          {
            rule: isMaxLength(50),
            message: t('users:data.login.tooLong', { max: 50 }),
          },
          {
            rule: isPattern(
              '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'
            ),
            message: t('users:data.login.invalid'),
          },
        ]}
      />

      <FieldInput
        name="email"
        label={t('users:data.email.label')}
        required={t('users:data.email.required') as string}
        validations={[
          {
            rule: isMinLength(5),
            message: t('users:data.email.tooShort', { min: 5 }),
          },
          {
            rule: isMaxLength(254),
            message: t('users:data.email.tooLong', { min: 254 }),
          },
          {
            rule: isEmail(),
            message: t('users:data.email.invalid'),
          },
        ]}
      />
      <FieldInput
        name="password"
        label="Password"
        required="Password is required"
      />
      <FieldSelect
        name="speciality"
        label="Speciality"
        required="Speciality Should Be Selected!"
        options={roles}
      />
      <FieldCheckboxes
        name="role"
        label={t('users:data.authorities.label')}
        options={authorities}
        required={t('users:data.authorities.required') as string}
      />
    </Stack>
  );
};
