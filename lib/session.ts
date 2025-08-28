export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const getSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting session from localStorage:', error);
    return null;
  }
};

export const setSession = (user: UserSession) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting session in localStorage:', error);
  }
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing session from localStorage:', error);
  }
};

export function getStoredUser() {
  return getSession();
}

export function isUserLoggedIn() {
  const user = getSession()
  return !!user
}

export function isAdmin() {
  const user = getSession()
  return user?.role === 'admin'
}

export function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/sign-in'
  }
}
