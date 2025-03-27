export const REQUEST_CREATED = 'REQUEST_CREATED';
export const REQUEST_DELETED = 'REQUEST_DELETED';
export const REQUEST_SCORED = 'REQUEST_SCORED';
export const REQUEST_CONFIRMED = 'REQUEST_CONFIRMED';
export const REQUEST_SCORE_CHANGED = 'REQUEST_SCORE_CHANGED';

export const ACTIONS = [
  REQUEST_CREATED,
  REQUEST_DELETED,
  REQUEST_SCORED,
  REQUEST_CONFIRMED,
  REQUEST_SCORE_CHANGED,
];

export const ACTIONS_LIST = [
  { id: REQUEST_CREATED, name: 'Request created' },
  { id: REQUEST_DELETED, name: 'Request deleted' },
  { id: REQUEST_SCORED, name: 'Request scored' },
  { id: REQUEST_CONFIRMED, name: 'Request confirmed' },
  { id: REQUEST_SCORE_CHANGED, name: 'Request score changed' },
];

export const ACTION_LIST_OBJ = {
  [REQUEST_CREATED]: 'Request created',
  [REQUEST_DELETED]: 'Request deleted',
  [REQUEST_SCORED]: 'Request scored',
  [REQUEST_CONFIRMED]: 'Request confirmed',
  [REQUEST_SCORE_CHANGED]: 'Request score changed',
};
