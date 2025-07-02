interface User {
  isAuthenticated: boolean;
  role?: 'client' | 'reader' | 'admin';
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export const getUserRole = (user: User): 'guest' | 'client' | 'reader' | 'admin' => {
  if (!user?.isAuthenticated) return 'guest';
  return user.role || 'client';
};

export const getUserRoleDisplay = (user: User): string => {
  const role = getUserRole(user);
  return role.toUpperCase();
};

export const isAdmin = (user: User): boolean => {
  return getUserRole(user) === 'admin';
};

export const isReader = (user: User): boolean => {
  return getUserRole(user) === 'reader';
};

export const isClient = (user: User): boolean => {
  return getUserRole(user) === 'client';
};

export const getDefaultDashboardRoute = (user: User): string => {
  const role = getUserRole(user);
  switch (role) {
    case 'admin':
      return 'AdminDashboard';
    case 'reader':
      return 'ReaderDashboard';
    default:
      return 'Dashboard';
  }
};