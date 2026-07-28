import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './context/authcontext';
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

function RotaPrivada({ children }) {
  const { token } = useAuth();
  if(token) {
    return children;
  }

  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <RotaPrivada>
            <div><Dashboard /></div>
          </RotaPrivada> 
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
