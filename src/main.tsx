import ReactDOM from 'react-dom/client'
import App from './App' // Removed .tsx extension
import './index.css'
import { AppProvider } from './store/store' // Removed .tsx extension

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> // Temporarily disabled for cleaner debugging
    <AppProvider>
      <App />
    </AppProvider>
  // </React.StrictMode>,
)
