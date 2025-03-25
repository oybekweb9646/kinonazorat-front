export const _RESPONSIBLE = 1;
export const _SUPER_ADMIN = 2;
export const _READ_ONLY = 3;
export const _AUTHORITY = 4;
export const _TERRITORIAL_RESPONSIBLE = 5;

export const ROLES = [_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY, _AUTHORITY, _TERRITORIAL_RESPONSIBLE];

export const ROLE_LIST = [
  { id: _SUPER_ADMIN, name: 'Super Admin' },
  { id: _RESPONSIBLE, name: 'Responsible' },
  { id: _TERRITORIAL_RESPONSIBLE, name: 'Territorial Responsible' },
  { id: _READ_ONLY, name: 'Read Only' },
  { id: _AUTHORITY, name: 'Authority' },
];
