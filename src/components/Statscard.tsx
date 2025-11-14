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
            elevation={3}
            sx={{
                p: 3.5,
                height: '100%',
                background: 'linear-gradient(135deg, rgba(26, 41, 66, 0.6) 0%, rgba(26, 41, 66, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${color}30`,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
                },
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 12px 32px ${color}40`,
                    borderColor: color,
                },
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5}}>
                <Box sx={{flex: 1}}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            mb: 1.5,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '2.5rem',
                            lineHeight: 1,
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon sx={{color, fontSize: 32}}/>
                </Box>
            </Box>
            {trend && (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        backgroundColor: trend.includes('+') ? '#4ADE8015' : '#F8717115',
                        border: trend.includes('+') ? '1px solid #4ADE8030' : '1px solid #F8717130',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: trend.includes('+') ? '#4ADE80' : '#F87171',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                        }}
                    >
                        {trend}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default StatsCard;