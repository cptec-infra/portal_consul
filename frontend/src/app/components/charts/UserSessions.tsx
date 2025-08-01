'use client';

import { List, ListItem, ListItemText, Typography } from '@mui/material';

const sessions = [
  { user: 'renato', ip: '192.168.0.10', since: '10:00' },
  { user: 'maria', ip: '192.168.0.15', since: '10:05' },
  { user: 'joao', ip: '192.168.0.20', since: '10:10' },
];

export default function UserSessions() {
  return (
    <>
      <Typography variant="h6" gutterBottom>Sessões Ativas</Typography>
      <List dense>
        {sessions.map((session, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${session.user} (${session.ip})`}
              secondary={`Desde ${session.since}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
