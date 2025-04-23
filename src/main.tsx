import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import './i18n';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);