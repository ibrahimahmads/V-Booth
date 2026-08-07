import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';

function App() {

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f7f9fb] font-sans text-[#191c1e] antialiased">
          <Toaster position="top-center" richColors closeButton />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App