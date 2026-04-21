import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a28',
              color: '#fff',
              border: '1px solid #2a2a38',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#1a1a28' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#1a1a28' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
