export type UserRole = 'ROLE_CHEF' | 'ROLE_EMPLOYEE' | 'ROLE_ADMIN';

export type User = {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  activated: boolean;
  langKey: string;
  authorities: UserRole[];
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  roles?: TODO;
};

export type UserList = {
  content: User[];
  totalItems: number;
};
