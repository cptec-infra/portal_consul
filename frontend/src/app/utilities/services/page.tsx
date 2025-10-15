'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, Paper, } from '@mui/material'; 
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchServices } from '@/app/api/api';
import { Service, Grouped } from './types';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useSelector } from 'react-redux';
import { useSearchStore } from '@/app/store/useSearchStore';


export default function ServicesPage() {
  const [services, setServices] = useState<Grouped[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Grouped | null>(null);
  const searchValue = useSearchStore((state) => state.value);
  
  useEffect(() => {
    const getServices = async () => {
      try {
        const rawData = await fetchServices();

        const groupedServices = Object.values(
          rawData.reduce((acc: { [key: string]: any[] }, item: Service) => {
            if (item.name) {
              if (!acc[item.name]) acc[item.name] = [];
              acc[item.name].push(item);
            }
            return acc;
          }, {})
        ).map((group) => ({
          name: group[0].name,
          nodes: group,
          hasCritical: group.some((s) => s.status === 'critical'),
          hasWarning: group.some((s) => s.status === 'warning'),
        }));

        setServices(groupedServices);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  const filteredServices = useMemo(() => {
    if (!searchValue.trim()) return services;
    return services.filter((service) => 
    service.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  }, [services, searchValue])

  const columns: GridColDef[] = [
    {
      field: 'statusIcon',
      headerName: '',
      width: 30,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as Grouped;
        return row.hasCritical ? (
          <ErrorIcon color="error" />
        ) : row.hasWarning ? (
          <WarningIcon color="warning" />
        ) : (
          <SuccessIcon color="success" />
        );
      },
    },
    {
      field: 'name',
      headerName: 'Serviço',
      flex: 1,
    },
    {
      field: 'hosts',
      headerName: 'Hosts detectados',
      flex: 1,
      renderCell: (params: any) => {
        const nodes = (params?.row as Grouped)?.nodes ?? [];
        return `${nodes.length} host(s) detectado(s)`;
      },
    },
  ];
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PanelGroup direction="vertical" style={{ flex: 1 }}>
        <Panel defaultSize={60} minSize={20}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: '99%', 
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#1e1e1e' : '#fafafa',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : services.length === 0 ? (
            <Typography variant="body1">Nenhum serviço disponível.</Typography>
          ) : (
            <DataGrid
              columns={columns}
              rows={filteredServices}
              getRowId={(row) => row.name}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: 'background.paper',
              }}
              onRowClick={(params) => setSelected(params.row)}
            />
        )}
          </Paper>
        </Panel>
      </PanelGroup>
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Hosts com o serviço {selected?.name}</DialogTitle>
        <DialogContent>
          {selected && (
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Node</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Datacenter</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selected.nodes.map((host: Service) => (
                  <TableRow key={host.node}>
                    <TableCell>{host.node}</TableCell>
                    <TableCell>{host.address}</TableCell>
                    <TableCell>{host.datacenter}</TableCell>
                    <TableCell>
                      <Typography
                        color={
                          host.status === 'critical'
                            ? 'error'
                            : host.status === 'warning'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {host.status || 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}