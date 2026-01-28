import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { makeServer } from './services/mockServer';

// Initialize mock server
if (process.env.NODE_ENV === 'development') {
  makeServer();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
