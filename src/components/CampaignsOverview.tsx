import React, { useEffect, useState } from 'react';
import {Box, IconButton, Chip, Dialog, DialogTitle, DialogContent, Grid, LinearProgress, Paper, Typography,} from '@mui/material';
import {Campaign as CampaignIcon} from '@mui/icons-material';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import {Campaign} from '../types/dashboard.types';
import {format} from 'date-fns';
import axios from "axios";

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
    const [open, setOpen] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);

    const handleOpen = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCampaign(null);
    };    

    return (
        <Paper
            elevation={3}
            sx={{
                background: 'linear-gradient(135deg, rgba(26, 41, 66, 0.6) 0%, rgba(26, 41, 66, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(253, 185, 19, 0.15)',
                borderRadius: 4,
                overflow: 'hidden',
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
                    Active Campaigns
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        mt: 0.5,
                    }}
                >
                    Ongoing phishing simulations
                </Typography>
            </Box>
            <Box sx={{p: 3.5}}>
                <Grid container spacing={2.5}>
                    {campaigns.map((campaign) => {
                        const statusConfig = getStatusConfig(campaign.status);
                        const clickRate =
                            campaign.target_count > 0
                                ? (campaign.click_count / campaign.target_count) * 100
                                : 0;

                        return (
                            <Grid size={{ xs: 12 }} key={campaign.id}>
                                <Box
                                    onClick={campaign.status === 'active' ? () => handleOpen(campaign) : undefined}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.06)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: campaign.status === 'active' ? 'pointer' : 'default',
                                        '&:hover': campaign.status === 'active'
                                            ? {
                                                backgroundColor: 'rgba(253, 185, 19, 0.08)',
                                                borderColor: 'rgba(253, 185, 19, 0.3)',
                                                transform: 'translateX(4px)',
                                            }
                                            : {},
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
            <CampaignDetailsDialog 
                open={open} 
                onClose={handleClose} 
                campaign={selectedCampaign} 
            />
        </Paper>
    );
};

const CampaignDetailsDialog = ({
    open,
    onClose,
    campaign,
}: {
    open: boolean;
    onClose: () => void;
    campaign: Campaign | null;
}) => {
    const [details, setDetails] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        if (!campaign || !open) return;

        const fetchData = async () => {
            try {
                // Example GET requests (replace with your real API endpoints)
                const detailsReq = axios.get(`/api/campaigns/${campaign.id}`);
                const statsReq = axios.get(`/api/campaigns/${campaign.id}/analytics`);

                const [detailsRes, statsRes] = await Promise.all([detailsReq, statsReq]);

                setDetails(detailsRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Error fetching campaign data", error);
            }
        };

        fetchData();
    }, [campaign, open]);

    const handleLaunch = async (campaign: Campaign) => {
        try {
            await axios.post(`/api/campaigns/${campaign.id}/launch`);
            alert("Campaign launched!");
        } catch (err) {
            console.error(err);
        }
    };
    
    const handlePause = async (campaign: Campaign) => {
        try {
            await axios.post(`/api/campaigns/${campaign.id}/pause`);
            alert("Campaign paused!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    pb: 1,
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {campaign?.persona_name}
                </Typography>

                {/* ❌ Emoji Close Button */}
                <IconButton onClick={onClose} sx={{ fontSize: "1.4rem" }}>
                    ❌
                </IconButton>
            </Box>

            {/* CONTENT */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, padding: 2 }}>
            {/* LAUNCH BUTTON */}
            {(campaign?.status === "paused" || campaign?.status === "draft") && (
                <IconButton
                    onClick={() => handleLaunch(campaign)}
                    sx={{
                        background: "rgba(34,197,94,0.15)",
                        display: "flex",
                        "&:hover": { background: "rgba(34,197,94,0.25)" },
                    }}
                >
                    <PlayArrowIcon sx={{ color: "#22C55E" }} />
                </IconButton>
            )}
    
            {/* PAUSE BUTTON */}
            {campaign?.status === "active" && (
                <IconButton
                    onClick={() => handlePause(campaign)}
                    sx={{
                        background: "rgba(239,68,68,0.15)",
                        "&:hover": { background: "rgba(239,68,68,0.25)" },
                    }}
                >
                    <PauseIcon sx={{ color: "#EF4444" }} />
                </IconButton>
            )}
        </Box>
        </Dialog>
    );
};


export default CampaignsOverview;