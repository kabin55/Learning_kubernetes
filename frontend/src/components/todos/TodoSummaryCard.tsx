import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Paper, Divider } from '@mui/material';
import { type TodoSummary } from '../../services/todos.service';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import WarningIcon from '@mui/icons-material/Warning';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';

interface Props {
  summary: TodoSummary | null;
}

const Widget = ({ icon, value, label, gradient }: { icon: React.ReactNode, value: number, label: string, gradient: string }) => (
  <Paper 
    className="glass-panel transition-all"
    sx={{ 
      p: 2.5, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: gradient,
      color: '#fff',
      borderRadius: 4,
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none'
      }
    }}
  >
    <Box sx={{ mb: 1, opacity: 0.9 }}>{icon}</Box>
    <Typography variant="h3" sx={{ fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.2)', lineHeight: 1 }}>
      {value}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.8, fontSize: '0.7rem' }}>
      {label}
    </Typography>
  </Paper>
);

const TodoSummaryCard: React.FC<Props> = ({ summary }) => {
  if (!summary) return null;

  const getDeadlineText = () => {
    if (!summary.nearestDeadline) return 'No upcoming deadlines';
    
    const deadlineDate = new Date(summary.nearestDeadline.deadline);
    const formattedDate = deadlineDate.toLocaleDateString();
    const formattedTime = deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${summary.nearestDeadline.title} - ${formattedDate} at ${formattedTime}`;
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 4, border: 'none' }} className="glass-panel">
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" /> Task Overview
        </Typography>
        <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Widget 
              icon={<AssignmentIcon fontSize="large" />} 
              value={summary.total} 
              label="Total" 
              gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)" 
            />
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Widget 
              icon={<CheckCircleIcon fontSize="large" />} 
              value={summary.completed} 
              label="Completed" 
              gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" 
            />
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Widget 
              icon={<PendingIcon fontSize="large" />} 
              value={summary.pending} 
              label="Pending" 
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
            />
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Widget 
              icon={<WarningIcon fontSize="large" />} 
              value={summary.overdue} 
              label="Overdue" 
              gradient="linear-gradient(135deg, #ff0844 0%, #ffb199 100%)"
            />
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Widget 
              icon={<TodayIcon fontSize="large" />} 
              value={summary.dueToday} 
              label="Due Today" 
              gradient="linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 2 }}>
            <Paper 
              className="glass-panel transition-all"
              sx={{ 
                p: 2.5, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #42275a 0%, #734b6d 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, opacity: 0.9 }}>
                <EventIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>Next Deadline</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                {getDeadlineText()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TodoSummaryCard;
