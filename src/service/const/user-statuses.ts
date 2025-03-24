export const _DELETED = 0;
export const _ACTIVE = 1;
export const _BANNED = 2;

export const USER_STATUS = [_DELETED, _ACTIVE, _BANNED];

export const USER_STATUS_LIST = [
  { id: _DELETED, name: 'Deleted', color: 'red' },
  { id: _ACTIVE, name: 'Active', color: 'green' },
  { id: _BANNED, name: 'Banned', color: 'red' },
];
