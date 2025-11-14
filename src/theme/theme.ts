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
            main: '#FFFFFF',
            light: '#FFFFFF',
            dark: '#F5F5F5',
            contrastText: '#1B3A4B',
        },
        background: {
            default: '#1B3A4B',
            paper: '#234558',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#FDB913',
        },
        error: {
            main: '#FF6B6B',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: '2rem',
            color: '#FFFFFF',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#FFFFFF',
        },
        body1: {
            fontSize: '1rem',
            color: '#FFFFFF',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                            borderColor: '#FDB913',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FDB913',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                            color: '#FDB913',
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
                    fontSize: '1rem',
                    padding: '12px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(253, 185, 19, 0.3)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #FDB913 0%, #FFCA3A 100%)',
                    color: '#1B3A4B',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #FFCA3A 0%, #FDB913 100%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#234558',
                },
            },
        },
    },
});

export default theme;