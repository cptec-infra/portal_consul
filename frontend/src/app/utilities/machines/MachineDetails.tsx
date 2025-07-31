'use client';

import { Tabs, Tab, Box, Typography, Paper, Divider } from '@mui/material';
import { useState } from 'react';
import { Machine } from './types';

interface Props {
  machine: Machine;
}

export default function MachineDetails({ machine }: Props) {
  const [tab, setTab] = useState(0);

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {value || '-'}
      </Typography>
    </Box>
  );

  return (
    <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        aria-label="Machine details tabs"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab label="Detalhes" />
        <Tab label="Rede" />
        <Tab label="Segurança" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      {tab === 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 3,
          }}
        >
          <DetailItem label="ID da Instância" value={machine.id} />
          <DetailItem label="Nome" value={machine.name} />
          <DetailItem label="Tipo" value={machine.type} />
          <DetailItem label="Status" value={machine.status} />
        </Box>
      )}

      {tab === 1 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 3,
          }}
        >
          <DetailItem label="Endereço IPv4" value={machine.ipv4} />
          <DetailItem label="DNS Privado" value={machine.dnsName} />
          <DetailItem label="Zona" value={machine.zone} />
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Regras de segurança em breve...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
