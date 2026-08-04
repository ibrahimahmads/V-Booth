import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7f9fb] font-sans text-[#191c1e] antialiased">
        <Toaster position="top-center" richColors closeButton />
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App