import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/XYZ';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { Auth0Provider } from '@auth0/auth0-react';
const root = ReactDOM.createRoot(document.getElementById('root'));

/* if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
} */
root.render(
  <React.StrictMode>
    <Auth0Provider domain="dev-dthz8r8zdgpgy3cx.us.auth0.com" clientId="G3hoa6rxU8ZkdmoPqhRVokktzwshTZ5w"
      authorizationParams={{ redirect_uri: window.location.origin}}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Auth0Provider>,
  </React.StrictMode>,
);
