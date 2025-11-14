import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {theme} from './theme/theme';
import {Dashboard, Login} from './components';
import {authService} from './services/auth.service';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const isAuthenticated = authService.isAuthenticated();
    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login/>
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;