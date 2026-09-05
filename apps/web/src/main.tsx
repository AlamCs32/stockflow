import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import '@/index.css';
import App from '@/App';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </TooltipProvider>
    </Provider>
  </React.StrictMode>
);
