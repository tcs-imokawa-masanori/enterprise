import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/capability-animations.css';
import './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { StreamProvider } from './contexts/StreamContext';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <StreamProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StreamProvider>
    </ThemeProvider>
  </StrictMode>
);
