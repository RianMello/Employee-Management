import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import LoginPage from "./pages/LoginPage/LoginPage";
import EmployeesPage from "./pages/EmployeesPage/EmployeesPage";
import EmployeeRegisterPage from "./pages/EmployeeRegister/EmployeeRegister";
import EmployeeDetails from "./pages/EmployeeDetails/EmployeeDetails";
import { useAuth } from "./context/AuthContext";

function AppContent() {
  const currentPath = useLocation();
  const toNavigate = useNavigate();

  const { currentUser, loading } = useAuth();

  if (loading) return null;
  return (
    <div className="App">
      {currentPath.pathname !== "/" && <Header />}
      <div className="mainContent">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {currentUser ? (
            <Route path="/employees" element={<EmployeesPage />} />
          ) : (
            toNavigate("/")
          )}
          {currentUser ? (
            <Route path="/register" element={<EmployeeRegisterPage />} />
          ) : (
            toNavigate("/")
          )}
          {currentUser ? (
            <Route path="/employee" element={<EmployeeDetails />} />
          ) : (
            toNavigate("/")
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <footer></footer>
    </div>
  );
}

export default App;
