import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './themeSlice';

// Hooks tipados para usar Redux en componentes
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Hook personalizado para el tema
export const useTheme = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();
  
  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => dispatch(toggleTheme()),
  };
};

