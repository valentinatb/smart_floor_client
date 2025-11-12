import { createSlice } from '@reduxjs/toolkit';

// Función para obtener el tema inicial desde localStorage
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
  }
  return 'light';
};

// Aplicar el tema inicial al documento antes de que React renderice
const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  if (initialTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: initialTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      
      // Aplicar el tema al documento
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (newTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
      
      // Guardar en localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', newTheme);
      }
    },
    setTheme: (state, action) => {
      const newTheme = action.payload;
      state.theme = newTheme;
      
      // Aplicar el tema al documento
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (newTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
      
      // Guardar en localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', newTheme);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

