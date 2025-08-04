'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import api, { fetchMachines } from '@/app/api/api';
import MachineDetails from './MachineDetails';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

interface Check {
  name: string;
  status: string;
  output: string;
}

interface Machine {
  address: string;
  name: string;
  node: string;
  node_address: string;
  datacenter: string;
  checks: Check[];
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  useEffect(() => {
    const getMachines = async () => {
      try {
        const data = await fetchMachines();
        setMachines(data);
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      } finally {
        setLoading(false);
      }
    };

    getMachines();
  }, []);

  const columns: GridColDef[] = [
    { field: 'node', headerName: 'Node', flex: 1 },
    { field: 'node_address', headerName: 'IP', flex: 1 },
    { field: 'datacenter', headerName: 'Datacenter', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const allPassing = params.row.checks?.every((check: Check) => check.status === 'passing');

        return allPassing ? (
          <CheckCircleIcon sx={{ color: 'green' }} />
        ) : (
          <WarningIcon sx={{ color: 'orange' }} />
        );
      },
    },
  ];

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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={machines}
                columns={columns}
                getRowId={(row) => row.address}
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
            )}
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
