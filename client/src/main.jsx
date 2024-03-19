// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import CssBaseLine from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from './theme.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <CssBaseLine />
    <App />
    <ToastContainer theme="colored" hideProgressBar position="bottom-left" autoClose={3000} closeOnClick />
  </CssVarsProvider>
  // </React.StrictMode>
);
