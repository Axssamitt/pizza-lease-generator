
import React from 'react'; // Make sure React is explicitly imported
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeContracts } from './utils/storageUtils';

// Initialize contracts from localStorage
initializeContracts();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
