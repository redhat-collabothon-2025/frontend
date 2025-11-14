import React from 'react';
import {Box, Chip, Divider, List, ListItem, ListItemText, Paper, Typography,} from '@mui/material';
import {Error as ErrorIcon, Info as InfoIcon, Warning as WarningIcon,} from '@mui/icons-material';
import {Incident} from '../types/dashboard.types';
import {format} from 'date-fns';

interface IncidentsListProps {
    incidents: Incident[];
}

const getSeverityConfig = (severity: string) => {
    switch (severity) {
        case 'LOW':
            return {
                color: '#4ADE80',
                bg: '#4ADE8020',
                icon: InfoIcon,
                label: 'Low',
            };
        case 'MEDIUM':
            return {
                color: '#FDB913',
                bg: '#FDB91320',
                icon: WarningIcon,
                label: 'Medium',
            };
        case 'CRITICAL':
            return {
                color: '#F87171',
                bg: '#F8717120',
                icon: ErrorIcon,
                label: 'Critical',
            };
        default:
            return {
                color: '#6B7280',
                bg: '#6B728020',
                icon: InfoIcon,
                label: 'Unknown',
            };
    }
};

export const IncidentsList: React.FC<IncidentsListProps> = ({incidents}) => {
    return (
        <Paper
            elevation={3}
            sx={{
                background: 'linear-gradient(135deg, rgba(26, 41, 66, 0.6) 0%, rgba(26, 41, 66, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(253, 185, 19, 0.15)',
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
            }}
        >
            <Box sx={{p: 3.5, borderBottom: '1px solid rgba(255, 255, 255, 0.08)'}}>
                <Typography
                    variant="h5"
                    sx={{
                        color: '#FFFFFF',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                    }}
                >
                    Recent Incidents
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        mt: 0.5,
                    }}
                >
                    Latest security alerts
                </Typography>
            </Box>
            <List sx={{p: 0}}>
                {incidents.map((incident, index) => {
                    const severityConfig = getSeverityConfig(incident.severity);
                    const Icon = severityConfig.icon;

                    return (
                        <React.Fragment key={incident.id}>
                            <ListItem
                                sx={{
                                    px: 3.5,
                                    py: 2.5,
                                    transition: 'background-color 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(253, 185, 19, 0.08)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        mr: 2,
                                        p: 1,
                                        borderRadius: 1.5,
                                        backgroundColor: severityConfig.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon sx={{color: severityConfig.color, fontSize: 20}}/>
                                </Box>
                                <ListItemText
                                    primary={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: '#FFFFFF',
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {incident.incident_type}
                                            </Typography>
                                            <Chip
                                                label={severityConfig.label}
                                                size="small"
                                                sx={{
                                                    backgroundColor: severityConfig.bg,
                                                    color: severityConfig.color,
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem',
                                                    height: 20,
                                                    border: `1px solid ${severityConfig.color}40`,
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    fontSize: '0.75rem',
                                                    mb: 0.25,
                                                }}
                                            >
                                                {incident.user_name} • {incident.user_email}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                    fontSize: '0.7rem',
                                                }}
                                            >
                                                {format(new Date(incident.created_at), 'MMM dd, yyyy HH:mm')}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < incidents.length - 1 && (
                                <Divider sx={{borderColor: 'rgba(255, 255, 255, 0.05)'}}/>
                            )}
                        </React.Fragment>
                    );
                })}
            </List>
        </Paper>
    );
};

export default IncidentsList;