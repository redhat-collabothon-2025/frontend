import React, {useEffect, useState} from 'react';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {theme} from './theme/theme';
import {Dashboard, Login} from './components';
import {authService} from './services/auth.service';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated();
            setIsAuthenticated(isAuth);
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {isAuthenticated ? <Dashboard/> : <Login onLoginSuccess={() => setIsAuthenticated(true)}/>}
        </ThemeProvider>
    );
}

export default App;