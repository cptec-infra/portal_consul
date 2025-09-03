'use client';

import { Paper, Box, Typography, Divider, Card, Chip } from '@mui/material';
import { Groups as GroupsIcon } from '@mui/icons-material';
import { Group } from './types';

interface Props {
  group: Group;
  onClose?: () => void;
}

export default function GroupDetails({ group, onClose }: Props) {
  return (
    <Paper sx={{ mt: 2, p: 3, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h5" fontWeight="700" gutterBottom>
        <GroupsIcon sx={{ mr: 1 }} /> {group?.cn}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1, pb: 2 }}>
            Descrição:
            <Typography component="span" fontWeight={600} color="text.primary">
              {group?.description || '-'}
            </Typography>
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1, pb: 2 }}>
            GID:
            <Typography component="span" fontWeight={600} color="text.primary">
              {group?.gidNumber || '-'}
            </Typography>
          </Typography>

          <Typography fontWeight="600" sx={{ display: 'flex', gap: 1, pb: 2 }}>
            Usuários do grupo:
          </Typography>

          {group?.memberUser && group?.memberUser.length > 0 ? (
            <Box display="flex" gap={1} flexWrap="wrap">
              {group?.memberUser.map((u, idx) => (
                <Chip key={idx} label={u} color="primary" variant="outlined" />
              ))}
            </Box>
          ) : (
            <Typography>Nenhum usuário cadastrado</Typography>
          )}
        </Card>
      </Box>
    </Paper>
  );
}
