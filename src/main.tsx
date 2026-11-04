import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted so no visitor IP reaches Google before consent.
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/dm-serif-text/400.css';
import App from './App.tsx';
import { setDefaultConsent } from './utils/analytics';

// Consent Mode defaults must exist before any tag can run.
setDefaultConsent();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
