'use client';

import { Box, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import MachineDetails from './MachineDetails';
import { Machine } from './types';

const mockMachines: Machine[] = [
  {
    id: 'i-0123456789abcdef0',
    name: 'Servidor Alpha',
    status: 'Rodando',
    type: 't2.micro',
    zone: 'us-east-1a',
    ipv4: '192.168.0.10',
    dnsName: 'alpha.internal',
  },
  {
    id: 'i-0abcdef1234567890',
    name: 'Servidor Beta',
    status: 'Parado',
    type: 't3.medium',
    zone: 'us-east-1b',
    ipv4: '192.168.0.11',
    dnsName: 'beta.internal',
  },
  {
    id: 'i-0bcdefabcdef12345',
    name: 'Servidor Gamma',
    status: 'Rodando',
    type: 't2.small',
    zone: 'us-west-2a',
    ipv4: '192.168.1.10',
    dnsName: 'gamma.internal',
  },
  {
    id: 'i-0abcd1234abcde6789',
    name: 'Servidor Delta',
    status: 'Parado',
    type: 't3.large',
    zone: 'eu-west-1b',
    ipv4: '192.168.2.10',
    dnsName: 'delta.internal',
  },
  {
    id: 'i-09abcdef123456789a',
    name: 'Servidor Epsilon',
    status: 'Rodando',
    type: 't2.medium',
    zone: 'ap-southeast-1a',
    ipv4: '192.168.3.10',
    dnsName: 'epsilon.internal',
  },
  {
    id: 'i-0fedcba9876543210',
    name: 'Servidor Zeta',
    status: 'Parado',
    type: 't3.micro',
    zone: 'us-west-2b',
    ipv4: '192.168.4.10',
    dnsName: 'zeta.internal',
  },
  {
    id: 'i-0abcdefabcdef1234',
    name: 'Servidor Eta',
    status: 'Rodando',
    type: 't2.large',
    zone: 'us-east-2a',
    ipv4: '192.168.5.10',
    dnsName: 'eta.internal',
  },
  {
    id: 'i-0bcd1234abcdef567',
    name: 'Servidor Theta',
    status: 'Parado',
    type: 't3.small',
    zone: 'eu-west-1a',
    ipv4: '192.168.6.10',
    dnsName: 'theta.internal',
  },
  {
    id: 'i-0fed12345abcdef678',
    name: 'Servidor Iota',
    status: 'Rodando',
    type: 't2.nano',
    zone: 'us-west-1c',
    ipv4: '192.168.7.10',
    dnsName: 'iota.internal',
  },
  {
    id: 'i-0abcd98765fedcba01',
    name: 'Servidor Kappa',
    status: 'Rodando',
    type: 't3.xlarge',
    zone: 'ap-northeast-1a',
    ipv4: '192.168.8.10',
    dnsName: 'kappa.internal',
  },
  {
    id: 'i-0bcdef1234abcdef99',
    name: 'Servidor Lambda',
    status: 'Parado',
    type: 't2.micro',
    zone: 'us-east-1c',
    ipv4: '192.168.9.10',
    dnsName: 'lambda.internal',
  },
  {
    id: 'i-0ab1234defcba67890',
    name: 'Servidor Mu',
    status: 'Rodando',
    type: 't3.large',
    zone: 'us-west-2a',
    ipv4: '192.168.10.10',
    dnsName: 'mu.internal',
  },
  {
    id: 'i-0abc9876543210def0',
    name: 'Servidor Nu',
    status: 'Parado',
    type: 't2.small',
    zone: 'us-west-1a',
    ipv4: '192.168.11.10',
    dnsName: 'nu.internal',
  },
  {
    id: 'i-0edcbafedcba56789a',
    name: 'Servidor Xi',
    status: 'Rodando',
    type: 't3.medium',
    zone: 'eu-central-1a',
    ipv4: '192.168.12.10',
    dnsName: 'xi.internal',
  },
  {
    id: 'i-0abcdef1234abcdef8',
    name: 'Servidor Omicron',
    status: 'Rodando',
    type: 't2.nano',
    zone: 'ap-southeast-1c',
    ipv4: '192.168.13.10',
    dnsName: 'omicron.internal',
  },
  {
    id: 'i-0a1b2c3d4e5f67890d',
    name: 'Servidor Pi',
    status: 'Parado',
    type: 't3.micro',
    zone: 'us-east-2b',
    ipv4: '192.168.14.10',
    dnsName: 'pi.internal',
  },
  {
    id: 'i-0b2c3d4e5f6789abcdef',
    name: 'Servidor Rho',
    status: 'Rodando',
    type: 't2.large',
    zone: 'us-west-2c',
    ipv4: '192.168.15.10',
    dnsName: 'rho.internal',
  },
  {
    id: 'i-0a1b2c3d4f5e67890f',
    name: 'Servidor Sigma',
    status: 'Rodando',
    type: 't3.small',
    zone: 'eu-west-1c',
    ipv4: '192.168.16.10',
    dnsName: 'sigma.internal',
  },
  {
    id: 'i-0fedcb9876543210f1',
    name: 'Servidor Tau',
    status: 'Parado',
    type: 't2.medium',
    zone: 'us-west-1b',
    ipv4: '192.168.17.10',
    dnsName: 'tau.internal',
  },
  {
    id: 'i-0abcdef1234abcdef78',
    name: 'Servidor Upsilon',
    status: 'Rodando',
    type: 't3.xlarge',
    zone: 'ap-northeast-1b',
    ipv4: '192.168.18.10',
    dnsName: 'upsilon.internal',
  },
  {
    id: 'i-0abc1234def567890d',
    name: 'Servidor Phi',
    status: 'Rodando',
    type: 't3.medium',
    zone: 'eu-central-1b',
    ipv4: '192.168.19.10',
    dnsName: 'phi.internal',
  },
  {
    id: 'i-0bcde123456789abcd0',
    name: 'Servidor Chi',
    status: 'Parado',
    type: 't2.small',
    zone: 'us-east-1d',
    ipv4: '192.168.20.10',
    dnsName: 'chi.internal',
  },
];


const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nome', flex: 1 },
  { field: 'id', headerName: 'ID da Máquina', flex: 1.5 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'type', headerName: 'Tipo', flex: 1 },
  { field: 'zone', headerName: 'Zona', flex: 1 },
];

export default function MachinesPage() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PanelGroup direction="vertical" style={{ flex: 1 }}>
        <Panel defaultSize={60} minSize={30}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#1e1e1e' : '#fafafa',
            }}
          >
            <DataGrid
              rows={mockMachines}
              columns={columns}
              getRowId={(row) => row.id}
              onRowClick={(params) => setSelectedMachine(params.row)}
              hideFooter
              sx={{
                border: 'none',
                height: '100%',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(224, 224, 224, 0.2)',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  fontWeight: 'bold',
                },
              }}
            />
          </Paper>
        </Panel>

        <PanelResizeHandle
          style={{
            height: '6px',
            background: '#ccc',
            cursor: 'row-resize',
          }}
        />

        <Panel defaultSize={40} minSize={40}>
          {selectedMachine ? (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 2,
                overflow: 'auto',
                mt: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2e2e2e' : '#fff',
              }}
            >
              <MachineDetails
                machine={selectedMachine}
                onClose={() => setSelectedMachine(null)}
              />
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 2,
                mt: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2e2e2e' : '#fff',
              }}
            >
              <Typography variant="body1">
                Selecione um servidor para ver os detalhes.
              </Typography>
            </Paper>
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
}



