import React from 'react';
import {
    Avatar,
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {User} from '../types/auth.types';

interface UsersTableProps {
    users: User[];
}

const getRiskColor = (level: string) => {
    switch (level) {
        case 'LOW':
            return {bg: '#4ADE8020', text: '#4ADE80', label: 'Low'};
        case 'MEDIUM':
            return {bg: '#FDB91320', text: '#FDB913', label: 'Medium'};
        case 'CRITICAL':
            return {bg: '#F8717120', text: '#F87171', label: 'Critical'};
        default:
            return {bg: '#6B728020', text: '#6B7280', label: 'Unknown'};
    }
};

export const UsersTable: React.FC<UsersTableProps> = ({users}) => {
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
                    High Risk Users
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        mt: 0.5,
                    }}
                >
                    Users requiring immediate attention
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{color: 'rgba(255, 255, 255, 0.7)', border: 'none'}}>
                                User
                            </TableCell>
                            <TableCell sx={{color: 'rgba(255, 255, 255, 0.7)', border: 'none'}}>
                                Risk Score
                            </TableCell>
                            <TableCell sx={{color: 'rgba(255, 255, 255, 0.7)', border: 'none'}}>
                                Risk Level
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => {
                            const riskColor = getRiskColor(user.risk_level);
                            return (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'rgba(253, 185, 19, 0.08)',
                                        },
                                        '&:last-child td': {
                                            borderBottom: 'none',
                                        },
                                    }}
                                >
                                    <TableCell sx={{border: 'none'}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    bgcolor: '#FDB913',
                                                    color: '#1B3A4B',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {user.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        color: '#FFFFFF',
                                                        fontWeight: 500,
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {user.name}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.5)',
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{border: 'none'}}>
                                        <Typography
                                            sx={{
                                                color: '#FFFFFF',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {user.risk_score.toFixed(1)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{border: 'none'}}>
                                        <Chip
                                            label={riskColor.label}
                                            size="small"
                                            sx={{
                                                backgroundColor: riskColor.bg,
                                                color: riskColor.text,
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                border: `1px solid ${riskColor.text}40`,
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default UsersTable;