import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    Campaign as CampaignIcon,
    Logout as LogoutIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {UsersTable} from './UsersTable';
import {IncidentsList} from './IncidentsList';
import {CampaignsOverview} from './CampaignsOverview';
import {dashboardService} from '../services/dashboard.service';
import {authService} from '../services/auth.service';
import {Campaign, DashboardStats, Incident} from '../types/dashboard.types';
import {User} from '../types/auth.types';
import StatsCard from "./Statscard";


const HexagonLogo: React.FC<{ size?: number }> = ({size = 40}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M50 5L93.3 27.5V72.5L50 95L6.7 72.5V27.5L50 5Z"
            fill="#FDB913"
            stroke="#FFCA3A"
            strokeWidth="2"
        />
        <path d="M50 30L70 45L60 65L40 65L30 45L50 30Z" fill="#1B3A4B"/>
    </svg>
);

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError('');

        try {
            const [statsData, usersData, campaignsData, incidentsData] =
                await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getUsers(),
                    dashboardService.getCampaigns(),
                    dashboardService.getIncidents(),
                ]);
            console.log({statsData, usersData, campaignsData, incidentsData});
            setStats(statsData);

            setUsers(
                usersData
                    .filter((u) => u.risk_level === 'CRITICAL' || u.risk_level === 'MEDIUM')
                    .slice(0, 5)
            );

            setCampaigns(
                campaignsData.filter((c) => c.status === 'active').slice(0, 3)
            );

            setIncidents(incidentsData.slice(0, 5));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };


    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleMenuClose();
        try {
            const refreshToken = authService.getRefreshToken();
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            authService.logoutLocal();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Logout error:', err);
            // Even if API call fails, clear local state and navigate
            authService.logoutLocal();
            navigate('/login', { replace: true });
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0A1929 0%, #1A2942 50%, #0F1E2E 100%)',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress sx={{color: '#FDB913'}} size={60} thickness={4}/>
                    <Typography sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Loading dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0A1929 0%, #1A2942 50%, #0F1E2E 100%)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '400px',
                    background: 'radial-gradient(circle at top center, rgba(253, 185, 19, 0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(10, 25, 41, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(253, 185, 19, 0.15)',
                    zIndex: 1100,
                }}
            >
                <Toolbar>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, flex: 1}}>
                        <HexagonLogo size={36}/>
                        <Typography
                            variant="h6"
                            sx={{
                                background: 'linear-gradient(135deg, #FDB913 0%, #FFCA3A 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                            }}
                        >
                            Security Dashboard
                        </Typography>
                    </Box>
                    <IconButton onClick={handleMenuOpen}>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: '#FDB913',
                                color: '#1B3A4B',
                            }}
                        >
                            <PersonIcon/>
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                backgroundColor: '#1A2942',
                                border: '1px solid rgba(253, 185, 19, 0.2)',
                                borderRadius: '12px',
                                minWidth: '180px',
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                color: '#FFFFFF',
                                py: 1.5,
                                px: 2,
                                borderRadius: '8px',
                                mx: 0.5,
                                '&:hover': {
                                    backgroundColor: 'rgba(253, 185, 19, 0.1)',
                                    '& .MuiSvgIcon-root': {
                                        transform: 'translateX(-2px)',
                                    },
                                },
                            }}
                        >
                            <LogoutIcon sx={{
                                mr: 1.5,
                                fontSize: 20,
                                color: '#FDB913',
                                transition: 'transform 0.2s',
                            }}/>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{py: 4}}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            color: '#FF6B6B',
                            border: '1px solid rgba(255, 107, 107, 0.3)',
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 5 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: '#FFFFFF',
                            fontWeight: 800,
                            mb: 1,
                            background: 'linear-gradient(135deg, #FFFFFF 0%, #FDB913 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Dashboard Overview
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                        }}
                    >
                        Monitor your security metrics and user activities
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{mb: 4}}>
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <StatsCard
                            title="Total Users"
                            value={stats?.total_users || 0}
                            icon={PeopleIcon}
                            color="#FDB913"
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <StatsCard
                            title="High Risk Users"
                            value={stats?.high_risk_users || 0}
                            icon={WarningIcon}
                            color="#F87171"
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <StatsCard
                            title="Active Campaigns"
                            value={stats?.active_campaigns || 0}
                            icon={CampaignIcon}
                            color="#4ADE80"
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <StatsCard
                            title="Avg Risk Score"
                            value={stats?.avg_risk_score?.toFixed(1) || '0.0'}
                            icon={TrendingUpIcon}
                            color="#60A5FA"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{xs: 12, lg: 8}}>
                        <Box sx={{mb: 3}}>
                            <UsersTable users={users}/>
                        </Box>
                        <CampaignsOverview campaigns={campaigns}/>
                    </Grid>
                    <Grid size={{xs: 12, lg: 4}}>
                        <IncidentsList incidents={incidents}/>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;