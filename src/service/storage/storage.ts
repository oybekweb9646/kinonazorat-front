export const storage = (session = false) => (session ? sessionStorage : localStorage);

export const setSidebarCollapsed = (value: boolean) => {
  storage().setItem('sidebarCollapsed', value ? 'true' : 'false');
};

export const getSidebarCollapsed = () => {
  return storage().getItem('sidebarCollapsed') === 'true';
};

export const removeSidebarCollapsed = () => {
  storage().removeItem('sidebarCollapsed');
};

export const setToken = (token: string) => {
  return storage().setItem('@token', token);
};

export const getToken = () => {
  return storage().getItem('@token');
};

export const removeToken = () => {
  return storage().removeItem('@token');
};
export const setRefreshToken = (token: string) => {
  return storage().setItem('@refreshToken', token);
};

export const getRefreshToken = () => {
  return storage().getItem('@refreshToken');
};

export const removeRefreshToken = () => {
  return storage().removeItem('@refreshToken');
};

export const setLanguage = (lang: string) => {
  return storage().setItem('@lang', lang);
};

export const getLanguage = () => {
  return storage().getItem('@lang');
};

export const removeLanguage = () => {
  return storage().removeItem('@lang');
};
