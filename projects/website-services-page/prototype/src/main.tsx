import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AudienceProvider } from './audience/AudienceContext';
import { App } from './App';
import './app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudienceProvider>
      <App />
    </AudienceProvider>
  </StrictMode>,
);
