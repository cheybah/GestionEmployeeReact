import React from 'react';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Code,
  HStack,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { ActionsButton } from '@/components/ActionsButton';
import { ConfirmMenuItem } from '@/components/ConfirmMenuItem';
import {
  DataList,
  DataListCell,
  DataListHeader,
  DataListRow,
} from '@/components/DataList';
import { Icon } from '@/components/Icons';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { UserStatus } from '@/spa/admin/users/UserStatus';
import {
  useUserList,
  useUserRemove,
  useUserUpdate,
} from '@/spa/admin/users/users.service';
import { Page, PageContent } from '@/spa/layout';

type UserActionProps = Omit<MenuProps, 'children'> & {
  user: TODO;
};

const UserActions = ({ user, ...rest }: UserActionProps) => {
  const { t } = useTranslation(['common', 'users']);
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const { mutate: userUpdate, ...userUpdateData } = useUserUpdate({
    onSuccess: ({ activated, username }) => {
      if (activated) {
        toastSuccess({
          title: t('users:feedbacks.activateUserSuccess.title'),
          description: t('users:feedbacks.activateUserSuccess.description', {
            username,
          }),
        });
      } else {
        toastSuccess({
          title: t('users:feedbacks.deactivateUserSuccess.title'),
          description: t('users:feedbacks.deactivateUserSuccess.description', {
            username,
          }),
        });
      }
    },
    onError: (_, { activated, username }) => {
      if (activated) {
        toastError({
          title: t('users:feedbacks.activateUserError.title'),
          description: t('users:feedbacks.activateUserError.description', {
            username,
          }),
        });
      } else {
        toastError({
          title: t('users:feedbacks.deactivateUserError.title'),
          description: t('users:feedbacks.deactivateUserError.description', {
            username,
          }),
        });
      }
    },
  });

  const isActionsLoading = userUpdateData.isLoading;

  const { mutate: userRemove, ...userRemoveData } = useUserRemove({
    onSuccess: (_, { username }) => {
      toastSuccess({
        title: t('users:feedbacks.deleteUserSuccess.title'),
        description: t('users:feedbacks.deleteUserSuccess.description', {
          username,
        }),
      });
    },
    onError: (_, { username }) => {
      toastError({
        title: t('users:feedbacks.deleteUserError.title'),
        description: t('users:feedbacks.deleteUserError.description', {
          username,
        }),
      });
    },
  });
  const removeUser = () => userRemove(user);
  const isRemovalLoading = userRemoveData.isLoading;

  return (
    <Menu isLazy placement="left-start" {...rest}>
      <MenuButton
        as={ActionsButton}
        isLoading={isActionsLoading || isRemovalLoading}
      />
      <Portal>
        <MenuList>
          <MenuItem
            as={Link}
            to={user.username}
            icon={<Icon icon={FiEdit} fontSize="lg" color="gray.400" />}
          >
            {t('common:actions.edit')}
          </MenuItem>
          <MenuDivider />
          <ConfirmMenuItem
            icon={<Icon icon={FiTrash2} fontSize="lg" color="gray.400" />}
            onClick={removeUser}
          >
            {t('common:actions.delete')}
          </ConfirmMenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export const PageUsers = () => {
  const { t } = useTranslation(['users']);
  const { users } = useUserList();

  return (
    <Page containerSize="xl">
      <PageContent>
        <HStack mb="4">
          <Box flex="1">
            <Heading size="md">{t('users:list.title')}</Heading>
          </Box>
          <Box>
            <Button
              display={{ base: 'none', sm: 'flex' }}
              as={Link}
              to="create"
              variant="@primary"
              leftIcon={<FiPlus />}
            >
              {t('users:list.actions.createUser')}
            </Button>
            <IconButton
              display={{ base: 'flex', sm: 'none' }}
              aria-label={t('users:list.actions.createUser')}
              as={Link}
              to="create"
              size="sm"
              variant="@primary"
              icon={<FiPlus />}
            />
          </Box>
        </HStack>

        <DataList>
          <DataListHeader isVisible={{ base: false, md: true }}>
            <DataListCell colName="login" colWidth="2">
              {t('users:data.login.label')} / {t('users:data.email.label')}
            </DataListCell>
            <DataListCell
              colName="id"
              colWidth="4rem"
              isVisible={{ base: false, lg: true }}
            >
              {t('users:data.id.label')}
            </DataListCell>
            <DataListCell
              colName="authorities"
              isVisible={{ base: false, lg: true }}
            >
              {t('users:data.authorities.label')}
            </DataListCell>
            <DataListCell
              colName="status"
              colWidth={{ base: '2rem', md: '0.5' }}
              align="center"
            >
              <Box as="span" display={{ base: 'none', md: 'block' }}>
                {t('users:data.status.label')}
              </Box>
            </DataListCell>
            <DataListCell colName="actions" colWidth="4rem" align="flex-end" />
          </DataListHeader>
          {!!users &&
            users?.map((user: TODO) => (
              <DataListRow as={LinkBox} key={'key' + user.user_id}>
                <DataListCell colName="login">
                  <HStack maxW="100%">
                    <Avatar size="sm" name={user.username} mx="1" />
                    <Box minW="0">
                      <Text noOfLines={1} maxW="full" fontWeight="bold">
                        <LinkOverlay as={Link} to={`${user.user_id}`}>
                          {user.username}
                        </LinkOverlay>
                      </Text>
                      <Text
                        noOfLines={1}
                        maxW="full"
                        fontSize="sm"
                        color="gray.600"
                        _dark={{ color: 'gray.300' }}
                      >
                        {user.email}
                      </Text>
                    </Box>
                  </HStack>
                </DataListCell>
                <DataListCell colName="id">
                  <Code maxW="full" fontSize="xs">
                    {user.user_id}
                  </Code>
                </DataListCell>
                <DataListCell colName="authorities">
                  <Wrap>
                    {user.authorities?.map((authority: TODO) => (
                      <WrapItem key={authority}>
                        <Badge size="sm">{authority}</Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </DataListCell>

                <DataListCell colName="status">
                  <UserStatus isActivated={!!user.enabled} />
                </DataListCell>
                <DataListCell colName="actions">
                  <UserActions user={user} />
                </DataListCell>
              </DataListRow>
            ))}
        </DataList>
      </PageContent>
    </Page>
  );
};
