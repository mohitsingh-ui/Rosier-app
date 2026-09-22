import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './storage';

type ThemePref = 'light' | 'dark' | 'system';

type AppState = {
  hydrated: boolean;
  onboarded: boolean;
  name: string;
  phone: string;
  email: string;
  themePref: ThemePref;
  menuOpen: boolean;
  notifications: { id: string; title: string; body: string; time: number; read: boolean }[];
  setOnboarded: (v: boolean) => void;
  setProfile: (p: Partial<Pick<AppState, 'name' | 'phone' | 'email'>>) => void;
  setThemePref: (t: ThemePref) => void;
  setMenuOpen: (v: boolean) => void;
  pushNotification: (title: string, body: string) => void;
  markAllRead: () => void;
  logout: () => void;
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      onboarded: false,
      name: 'Ankur',
      phone: '',
      email: '',
      themePref: 'light',
      menuOpen: false,
      notifications: [
        {
          id: 'welcome',
          title: 'Welcome to Rosier 🌾',
          body: 'We just added welcome coins to your wallet. Use them on your first order.',
          time: Date.now(),
          read: false,
        },
      ],
      setOnboarded: (v) => set({ onboarded: v }),
      setProfile: (p) => set(p),
      setThemePref: (t) => set({ themePref: t }),
      setMenuOpen: (v) => set({ menuOpen: v }),
      pushNotification: (title, body) =>
        set((s) => ({
          notifications: [
            { id: String(Date.now()), title, body, time: Date.now(), read: false },
            ...s.notifications,
          ].slice(0, 30),
        })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      logout: () => set({ onboarded: false, menuOpen: false }),
    }),
    {
      name: 'rosier-app',
      storage,
      partialize: ({ hydrated, menuOpen, ...rest }) => rest,
      onRehydrateStorage: () => () => {
        useApp.setState({ hydrated: true });
      },
    },
  ),
);
