'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { fetchMachines } from '@/app/api/api';
import MachineDetails from './MachineDetails';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/store/store';

interface Machine {
  name: string;
  address?: string;
  datacenter?: string;
  id?: string;
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const searchTerm = useSelector((state: RootState) => state.search.value);

  useEffect(() => {
    const getMachines = async () => {
      try {
        const data = await fetchMachines();
        setMachines(data);
      } catch (error) {
        console.error('Error fetching machines:', error);
      } finally {
        setLoading(false);
      }
    };

    getMachines();
  }, []);

  const filteredMachines = useMemo(() => {
    if (!searchTerm) return machines;
    return machines.filter((machine) =>
      Object.values(machine)
        .filter((v) => typeof v === 'string')
        .some((value) =>
          (value as string).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [machines, searchTerm]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Servers', flex: 1 },
    { field: 'address', headerName: 'IP', flex: 1 },
    { field: 'datacenter', headerName: 'Datacenter', flex: 1 },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PanelGroup direction="vertical" style={{ flex: 1 }}>
        <Panel defaultSize={50} minSize={20}>
          <Paper
            elevation={1}
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
                rows={filteredMachines}
                columns={columns}
                getRowId={(row) => row.name!}
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

        <Panel defaultSize={50} minSize={20}>
          {selectedMachine ? (
            <Paper
              elevation={2}
              sx={{
                p: 0,
                height: '100%',
                borderRadius: 2,
                overflow: 'auto',
                mt: 0,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2e2e2e' : '#fff',
              }}
            >
              <MachineDetails
                node={selectedMachine.name || ''}
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
                Selecione o host para ver os detalhes.
              </Typography>
            </Paper>
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
}
