'use client';

import {Paper, Box, Typography, Divider, Accordion, AccordionSummary,AccordionDetails, Card, Chip, Grid, Tooltip, IconButton, Tabs, Tab} from '@mui/material';
import {ExpandMore as ExpandMoreIcon,Person as PersonIcon,AlternateEmail as EmailIcon,Badge as BadgeIcon,Home as HomeIcon,Groups as GroupsIcon,Phone as PhoneIcon,Devices as DevicesIcon,Key as KeyIcon,CalendarMonth as CalendarIcon,Visibility as VisibilityIcon,VisibilityOff as VisibilityOffIcon} from '@mui/icons-material';
import { useState } from 'react';
import { User } from './types';

interface Props {
  user: User;
  onClose?: () => void;
}

  export default function UserDetails({ user, onClose }: Props) {
  const [tab, setTab] = useState(0);
  const [showUid, setShowUid] = useState(false);

  const handleTabChange = (_: any, val: number) => {
    setTab(val);
  };

  function formatKrbDate(krbDate?: string) {
    if (!krbDate) return '-';
    
    const year = Number(krbDate.slice(0, 4));
    const month = Number(krbDate.slice(4, 6)) - 1;
    const day = Number(krbDate.slice(6, 8));
    const hour = Number(krbDate.slice(8, 10));
    const minute = Number(krbDate.slice(10, 12));
    const second = Number(krbDate.slice(12, 14));

    const date = new Date(Date.UTC(year, month, day, hour, minute, second));

    return date.toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'medium',
      timeZone: 'GMT',
    });
  }

  return(
    <Paper sx={{ mt: 2, p: 3, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h5" fontWeight="700" gutterBottom>
        <PersonIcon sx={{ mr: 1 }} /> {user.firstname} {user.lastname}
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} textColor="primary" indicatorColor="primary" sx={{ mb: 3 }}>
        <Tab label="Conta" />
        <Tab label="Grupos" />
        <Tab label="Redes" />
      </Tabs>
      <Divider sx={{ mb: 3 }} />

      {tab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1, pb: 2 }}>
              Email:
              <Typography component="span" fontWeight="600" color="text.primary" >
                {user.mail || '-'}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1, pb: 2 }}>
              Ramal: 
              <Typography component="span" fontWeight={600} color="text.primary">
                {user.telephoneNumber || '-'}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1, pb: 2 }}>
              Expiração da Senha:
              <Typography component="span" fontWeight={600} color="text.primary">
                {formatKrbDate(user.passwordExpiration) || '-'}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1, pb: 2 }}>
              Home:
              <Typography component="span" fontWeight={600} color="text.primary">
                {user.homeDirectory || '-'}
              </Typography>
            </Typography>
          </Card>
        </Box>
        )}
        
        {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight="600" sx={{ display: 'flex', gap: 1, pb: 2 }}>
              <GroupsIcon sx={{ mr: 1 }}/> Grupos 
            </Typography>
            {user.memberOfGroup && user.memberOfGroup.length > 0 ? (
              <Box display="flex" gap={1} flexWrap="wrap">
                {user.memberOfGroup.map((g, idx) => (
                  <Chip key={idx} label={g} color="secondary" variant="outlined" />
                ))}
              </Box>
            ) : (
              <Typography>Nenhum grupo</Typography>
            )}
          </Card>
        </Box>  
        )}

        {tab === 2 && (    
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight="600" sx={{ display: 'flex', gap: 1, pb: 2 }}>
              <DevicesIcon sx={{ mr: 1 }} /> Macs
            </Typography>
            {user.macs && user.macs.length > 0 ? (
              <Box display="flex" gap={1} flexWrap="wrap">
                {user.macs.map((m, idx) => (
                  <Chip key={idx} label={m} color="primary" variant="outlined" />
                ))}
              </Box>
            ) : (
              <Typography>Nenhum MAC cadastrado</Typography>
            )}
          </Card>
        </Box>
      )}
    </Paper>
  );
}
