import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Expand Telegram Web App to full height
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#000000');
  tg.setBackgroundColor('#000000');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
