import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface DarkModeContextValue {
  dark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue>({ dark: false, toggle: () => {} });

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('cl-dark-mode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('cl-dark-mode', String(dark));
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
