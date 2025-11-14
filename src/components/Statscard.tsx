import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {SvgIconComponent} from '@mui/icons-material';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: SvgIconComponent;
    trend?: string;
    color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
                                                        title,
                                                        value,
                                                        icon: Icon,
                                                        trend,
                                                        color = '#FDB913',
                                                    }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(135deg, #234558 0%, #1B3A4B 100%)',
                border: '1px solid rgba(253, 185, 19, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(253, 185, 19, 0.2)',
                    borderColor: color,
                },
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'flex-start', mb: 2}}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: `${color}20`,
                        display: 'flex',
                        mr: 2,
                    }}
                >
                    <Icon sx={{color, fontSize: 28}}/>
                </Box>
                <Box sx={{flex: 1}}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.875rem',
                            mb: 0.5,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '2rem',
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            </Box>
            {trend && (
                <Typography
                    variant="body2"
                    sx={{
                        color: trend.includes('+') ? '#4ADE80' : '#F87171',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                    }}
                >
                    {trend}
                </Typography>
            )}
        </Paper>
    );
};

export default StatsCard;