import React from 'react';
import { Box, Typography, Paper, Link } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  type?: string;
  targetId?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onActivityClick?: (activity: ActivityItem) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, onActivityClick }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <Box sx={{ mt: 2 }}>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <Box key={activity.id} sx={{ mb: 1 }}>
              <Typography variant="body2">
                • {onActivityClick ? (
                  <Link 
                    component="button"
                    variant="body2"
                    onClick={() => onActivityClick(activity)}
                    sx={{ textAlign: 'left', textDecoration: 'none' }}
                  >
                    {activity.action}
                  </Link>
                ) : (
                  activity.action
                )} - {dayjs(activity.timestamp).fromNow()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No recent activity</Typography>
        )}
      </Box>
    </Paper>
  );
};
