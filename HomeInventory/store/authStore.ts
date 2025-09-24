import { create } from 'zustand';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  initializeAuth: () => () => void; // Returns the unsubscribe function
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, isLoggedIn: !!user, isLoading: false });
    });
    return unsubscribe;
  },
}));

export default useAuthStore;
