import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import './App.css'
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background">
        <Router>
          {/* Toggle de tema fijo en la esquina superior derecha */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  )
}

export default App
