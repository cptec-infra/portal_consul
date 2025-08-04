'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { fetchMachines } from '@/app/api/api';
import MachineDetails from './MachineDetails';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';


interface Machine {
  name?: string;
  address?: string;
  datacenter?: string;
  id?: string;
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  useEffect(() => {
    const getMachines = async () => {
      try {
        const data = await fetchMachines();
        console.log('Máquinas obtidas:', data);
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
    { field: 'name', headerName: 'Servidores', flex: 1 },
    { field: 'address', headerName: 'IP', flex: 1 },
    { field: 'datacenter', headerName: 'Datacenter', flex: 1 },
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
<<<<<<< HEAD
		{console.log('machines: ', machines)}
=======
            {
              console.log('Máquinas:', machines)
            }
            {
              console.log('Colunas:', columns)
            }
>>>>>>> c76a414b2b58108fb98e7314b872ca2662db7077
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={machines}
                columns={columns}
                getRowId={(row) => row.id!}
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
