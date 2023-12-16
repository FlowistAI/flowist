import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './pages/App';

import './main.css';
import './tailwind.css'
import { Composed } from './composed';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Composed>
      <App />
    </Composed>
  </React.StrictMode>
);
