export const Role = {
  MANAGER: 'ROLE_MANAGER',
  STAFF: 'ROLE_STAFF',
  USER: 'ROLE_USER',
} as const;

export type Role =
  typeof Role[keyof typeof Role];

export const RoleLabel: Record<Role, string> = {
  ROLE_MANAGER: 'Manager',
  ROLE_STAFF: 'Staff',
  ROLE_USER: 'User',
};


export const Permission = {
  UPLOAD_CSV: 'UPLOAD_CSV',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  UPDATE_ACCOUNT: 'UPDATE_ACCOUNT',
  ADD_BOOK_INSTANCE: 'ADD_BOOK_INSTANCE',
  ADD_BOOK_DATA: 'ADD_BOOK_DATA',
  ADD_INFORMATION: 'ADD_INFORMATION',
  REMOVE_ACCOUNT: 'REMOVE_ACCOUNT',
  REMOVE_BOOK: 'REMOVE_BOOK',
  REMOVE_INFORMATION: 'REMOVE_INFORMATION',
  UPDATE_COUPON: 'UPDATE_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON',
  CREATE_COUPON: 'CREATE_COUPON',
  VIEW_COUPON: 'VIEW_COUPON',
  GENERATE_REPORT: 'GENERATE_REPORT',
} as const;

export type Permission =
  typeof Permission[keyof typeof Permission];


export const PermissionLabel: Record<Permission, string> = {
  UPLOAD_CSV: 'Upload CSV',
  CREATE_ACCOUNT: 'Create account',
  UPDATE_ACCOUNT: 'Update account',
  ADD_BOOK_INSTANCE: 'Add book instance',
  ADD_BOOK_DATA: 'Add book data',
  ADD_INFORMATION: 'Add information',
  REMOVE_ACCOUNT: 'Remove account',
  REMOVE_BOOK: 'Remove book',
  REMOVE_INFORMATION: 'Remove information',
  UPDATE_COUPON: 'Update coupon',
  REMOVE_COUPON: 'Remove coupon',
  CREATE_COUPON: 'Create coupon',
  VIEW_COUPON: 'View coupon',
  GENERATE_REPORT: 'Generate report',
};
