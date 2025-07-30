// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/campaign/common/Dashboard";
import CampaignBuilder from "./components/campaign/CampaignBuilder";
import ThemeSwitcher from "./components/campaign/common/ThemeSwitcher";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { CampaignProvider } from "./contexts/CampaignContext";
import "./styles.css";
import ErrorBoundary from "./components/campaign/common/ErrorBoundary";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <DndProvider backend={HTML5Backend}>
            <Router>
              <div className="App">
                <Navbar />
                <div className="container">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <CampaignProvider>
                            {" "}
                            {/* Added CampaignProvider here */}
                            <Dashboard />
                          </CampaignProvider>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campaign/:id"
                      element={
                        <ProtectedRoute>
                          <WebSocketProvider>
                            <CampaignProvider>
                              <CampaignBuilder />
                            </CampaignProvider>
                          </WebSocketProvider>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
                <ThemeSwitcher />
              </div>
            </Router>
          </DndProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
