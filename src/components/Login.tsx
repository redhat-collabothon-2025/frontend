import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { authService } from '../services/auth.service';
import { LoginRequest } from '../types/auth.types';

const HexagonLogo: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      mb: 4,
      animation: 'fadeInRotate 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      '@keyframes fadeInRotate': {
        from: { opacity: 0, transform: 'translateY(-30px) rotate(-10deg) scale(0.8)' },
        to: { opacity: 1, transform: 'translateY(0) rotate(0deg) scale(1)' },
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        '&:hover svg': {
          transform: 'scale(1.05) rotate(5deg)',
        },
      }}
    >
      <svg
        width="90"
        height="90"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 8px 16px rgba(253, 185, 19, 0.3))',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDB913" />
            <stop offset="100%" stopColor="#FFCA3A" />
          </linearGradient>
        </defs>
        <path
          d="M50 5L93.3 27.5V72.5L50 95L6.7 72.5V27.5L50 5Z"
          fill="url(#hexGradient)"
          stroke="#FFCA3A"
          strokeWidth="2.5"
        />
        <path
          d="M50 30L70 45L60 65L40 65L30 45L50 30Z"
          fill="#0A1929"
        />
      </svg>
    </Box>
  </Box>
);

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      console.log('Login successful:', response.user);
      // Navigate to dashboard using React Router
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Invalid email or password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A1929 0%, #1A2942 50%, #0F1E2E 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(253, 185, 19, 0.15) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          left: '-20%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite 4s',
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 4,
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(26, 41, 66, 0.9)',
            border: '1px solid rgba(253, 185, 19, 0.15)',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(253, 185, 19, 0.1)',
            animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(40px) scale(0.96)' },
              to: { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
          }}
        >
          <HexagonLogo />

          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FDB913 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 1.5,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              mb: 4,
              fontSize: '1.05rem',
            }}
          >
            Sign in to access your security dashboard
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255, 107, 107, 0.08)',
                color: '#FF8787',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: '12px',
                fontWeight: 500,
                animation: 'shake 0.4s cubic-bezier(.36,.07,.19,.97)',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-8px)' },
                  '75%': { transform: 'translateX(8px)' },
                },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#FDB913' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#FDB913' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.8,
                fontSize: '1.05rem',
                fontWeight: 700,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(253, 185, 19, 0.25)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transition: 'left 0.6s',
                },
                '&:hover::before': {
                  left: '100%',
                },
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(253, 185, 19, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={26} sx={{ color: '#0A1929' }} thickness={4} />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#4ADE80',
                  animation: 'blink 2s ease-in-out infinite',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 0.5 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: 500,
                }}
              >
                Secured with end-to-end encryption
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;