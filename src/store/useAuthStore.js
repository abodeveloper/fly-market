import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      authModal: null, // 'login', 'register', or null
      setAuthModal: (modal) => set({ authModal: modal }),
      login: (userData) => {
        set({ user: userData, isAuthenticated: true, authModal: null });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (userData) => {
        set((state) => ({ ...state, user: { ...state.user, ...userData } }));
      }
    }),
    {
      name: 'auth-storage', // unique name
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
