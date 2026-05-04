import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// This is the main entry point of the React application
// It grabs the 'root' DOM node from index.html and renders the App component inside it.
createRoot(document.getElementById('root')!).render(
  // StrictMode highlights potential problems in an application by running components twice in development
  <StrictMode>
    <App />
  </StrictMode>,
);
