import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/authContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <App />
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#10b981', // green for success
          },
        },
        error: {
          style: {
            background: '#ef4444', // red for error
          },
        },
      }}
    />
  </AuthContextProvider>,
)
