import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FDB913',
            light: '#FFCA3A',
            dark: '#E5A700',
            contrastText: '#1B3A4B',
        },
        secondary: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#0A1929',
            paper: '#1A2942',
        },
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
        error: {
            main: '#FF6B6B',
            light: '#FF8787',
            dark: '#EE5A52',
        },
        success: {
            main: '#4ADE80',
            light: '#6EE7A2',
            dark: '#22C55E',
        },
        warning: {
            main: '#FBBF24',
            light: '#FCD34D',
            dark: '#F59E0B',
        },
        info: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '3.5rem',
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
        },
        h4: {
            fontWeight: 700,
            fontSize: '1.75rem',
            letterSpacing: '-0.005em',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#FDB913 #1A2942',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#1A2942',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#FDB913',
                        borderRadius: '4px',
                        '&:hover': {
                            background: '#FFCA3A',
                        },
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        backdropFilter: 'blur(10px)',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: '1.5px',
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': {
                                borderColor: '#FDB913',
                            },
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 0 0 4px rgba(253, 185, 19, 0.1)',
                            '& fieldset': {
                                borderColor: '#FDB913',
                                borderWidth: '2px',
                            },
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        '&.Mui-focused': {
                            color: '#FDB913',
                            fontWeight: 600,
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        color: '#FFFFFF',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderRadius: '12px',
                    padding: '12px 28px',
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(253, 185, 19, 0.25)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #FDB913 0%, #FFCA3A 100%)',
                    color: '#0A1929',
                    fontWeight: 700,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #FFCA3A 0%, #FDB913 100%)',
                        boxShadow: '0 12px 32px rgba(253, 185, 19, 0.35)',
                    },
                    '&.Mui-disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)',
                    },
                },
                outlined: {
                    borderColor: 'rgba(253, 185, 19, 0.5)',
                    color: '#FDB913',
                    borderWidth: '2px',
                    '&:hover': {
                        borderColor: '#FDB913',
                        backgroundColor: 'rgba(253, 185, 19, 0.08)',
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1A2942',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                },
                elevation2: {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                },
                elevation3: {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                },
                elevation24: {
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(253, 185, 19, 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        borderColor: 'rgba(253, 185, 19, 0.2)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                },
                head: {
                    fontWeight: 700,
                    color: '#FDB913',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    height: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                bar: {
                    borderRadius: '8px',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(26, 41, 66, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
    },
});

export default theme;