import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, RegisterData } from '../types/user';

// Production authentication uses real database and API endpoints

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Call real authentication API
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          });
          
          if (!response.ok) {
            throw new Error('Invalid email or password');
          }
          
          const data = await response.json();
          const { token, user } = data;
          
          // Store auth token
          await AsyncStorage.setItem('authToken', token);
          
          set({ 
            user: user as User, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          // Call real registration API
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
          }
          
          const data = await response.json();
          const { token, user } = data;
          
          // Store auth token
          await AsyncStorage.setItem('authToken', token);
          
          set({ 
            user: user as User, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateBalance: (amount: number) => {
        const { user } = get();
        if (user && user.role === 'client') {
          const clientUser = user as any;
          set({
            user: {
              ...user,
              balance: clientUser.balance + amount,
            } as User
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);