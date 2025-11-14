import React from 'react';
import {Box, Chip, Grid, LinearProgress, Paper, Typography,} from '@mui/material';
import {Campaign as CampaignIcon} from '@mui/icons-material';
import {Campaign} from '../types/dashboard.types';
import {format} from 'date-fns';

interface CampaignsOverviewProps {
    campaigns: Campaign[];
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'active':
            return {color: '#4ADE80', bg: '#4ADE8020', label: 'Active'};
        case 'paused':
            return {color: '#FDB913', bg: '#FDB91320', label: 'Paused'};
        case 'completed':
            return {color: '#6B7280', bg: '#6B728020', label: 'Completed'};
        case 'draft':
            return {color: '#60A5FA', bg: '#60A5FA20', label: 'Draft'};
        default:
            return {color: '#6B7280', bg: '#6B728020', label: 'Unknown'};
    }
};

export const CampaignsOverview: React.FC<CampaignsOverviewProps> = ({
                                                                        campaigns,
                                                                    }) => {
    return (
        <Paper
            sx={{
                background: 'linear-gradient(135deg, #234558 0%, #1B3A4B 100%)',
                border: '1px solid rgba(253, 185, 19, 0.2)',
                borderRadius: 3,
                overflow: 'hidden',
            }}
        >
            <Box sx={{p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#FFFFFF',
                        fontWeight: 600,
                    }}
                >
                    Active Campaigns
                </Typography>
            </Box>
            <Box sx={{p: 3}}>
                <Grid container spacing={2}>
                    {campaigns.map((campaign) => {
                        const statusConfig = getStatusConfig(campaign.status);
                        const clickRate =
                            campaign.target_count > 0
                                ? (campaign.click_count / campaign.target_count) * 100
                                : 0;

                        return (
                            <Grid size={{ xs: 12 }} key={campaign.id}>
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'rgba(253, 185, 19, 0.05)',
                                            borderColor: '#FDB913',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 2,
                                        }}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 1.5,
                                                    backgroundColor: '#FDB91320',
                                                    display: 'flex',
                                                }}
                                            >
                                                <CampaignIcon sx={{color: '#FDB913', fontSize: 20}}/>
                                            </Box>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        color: '#FFFFFF',
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        mb: 0.25,
                                                    }}
                                                >
                                                    {campaign.persona_name}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.6)',
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {campaign.scenario}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={statusConfig.label}
                                            size="small"
                                            sx={{
                                                backgroundColor: statusConfig.bg,
                                                color: statusConfig.color,
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                height: 22,
                                                border: `1px solid ${statusConfig.color}40`,
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{mb: 1.5}}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                Click Rate
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: '#FDB913',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                {clickRate.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={clickRate}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 3,
                                                    background:
                                                        'linear-gradient(90deg, #FDB913 0%, #FFCA3A 100%)',
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.5)',
                                                fontSize: '0.7rem',
                                            }}
                                        >
                                            {campaign.click_count} / {campaign.target_count} targets
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.5)',
                                                fontSize: '0.7rem',
                                            }}
                                        >
                                            {format(new Date(campaign.sent_at), 'MMM dd')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Paper>
    );
};

export default CampaignsOverview;