'use client';

import { fetchMachinesDetails } from '@/app/api/api';
import { Tabs, Tab, Box, Typography, Paper, Divider, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';


interface Machine {
  name: string;
  id: string;
  address: string;
  port: number;
  datacenter: string;
  node: string;
  status: string;
}

interface Props {
  node: string;
}

export default function MachineDetails({ node }: Props) {
  const [tab, setTab] = useState(0);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      try {
        const allMachines = await fetchMachinesDetails();
        const found = allMachines.find((m: Machine) => m.node === node);
        setMachine(found || null);
      } catch (error) {
        console.error('Erro ao carregar dados da máquina:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [node]);

  const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {value || '-'}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Paper elevation={2} sx={{ mt: 4, p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Carregando detalhes...
        </Typography>
      </Paper>
    );
  }

  if (!machine) {
    return (
      <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
        <Typography color="error">Máquina não encontrada.</Typography>
      </Paper>
    );
  }

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
          <DetailItem label="Nome" value={machine.name} />
          <DetailItem label="Datacenter" value={machine.datacenter} />
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
          <DetailItem label="Endereço IP" value={machine.address} />
          <DetailItem label="Porta" value={machine.port} />
          <DetailItem label="Node" value={machine.node} />
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
