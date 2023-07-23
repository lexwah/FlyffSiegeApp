import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './layout/App/App';
import './css/colors.css';
import './css/index.css';
import './css/animations.css';
import 'react-datepicker/dist/react-datepicker.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
