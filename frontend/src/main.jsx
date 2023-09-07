import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./index.css"
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import { ErrorBoundary } from 'react-error-boundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorPage}>
    <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
