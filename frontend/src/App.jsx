import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BagProvider } from './context/BagContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';
import './styles/components.css';

export const App = () => {
  return (
    <BagProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BagProvider>
  );
};

export default App;
