import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.jsx';
import { initPurchases } from './services/purchases';
import './index.css';

// Initialise RevenueCat (no-op on web, configures SDK on native)
initPurchases();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
