'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { fetchMachinesDetails } from '@/app/api/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import SuccessIcon from '@mui/icons-material/CheckCircle';

interface Service {
  name: string;
  address?: string;
  datacenter?: string;
  id?: string;
  node?: string;
  status?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<{ node: string; services: Service[]; hasCritical: boolean; hasWarning: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      try {
        const rawData = await fetchMachinesDetails();
       
        const groupedServices = Object.values(
          rawData.reduce((acc: { [key: string]: Service[] }, service) => {
            if (service.node) {
              if (!acc[service.node]) {
                acc[service.node] = [];
              }
              acc[service.node].push(service);
            }
            return acc;
          }, {})
        ).map((group) => ({
          node: group[0].node,
          services: group,
          hasCritical: group.some((s) => s.status === 'critical'),
          hasWarning: group.some((s) => s.status === 'warning'),
        }));

        console.log('Serviços agrupados:', groupedServices);

        setServices(groupedServices);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
    <PanelGroup direction="vertical" style={{ flex: 1}}>
      <Panel defaultSize={100} minSize={30}   className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            borderRadius: 1,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : services.length === 0 ? (
            <Typography variant="body1">Nenhum serviço disponível.</Typography>
          ) : (
            services.map((group) => (
              <Accordion
                key={group.node}
                sx={{
                  mb: 2,
                  '&:last-child': { mb: 0 }, 
                  borderRadius: 4,
                  border: 'none', 
                  '& .MuiAccordionSummary-root': {
                    borderBottom: 'none',
                  },
                  '& .MuiAccordionDetails-root': {
                    padding: '0 16px 16px',
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{group.node}</Typography>
                    {group.hasCritical ? (
                      <ErrorIcon color="error" sx={{ ml: 1 }} />
                    ) : group.hasWarning ? (
                      <WarningIcon color="warning" sx={{ ml: 1 }} />
                    ) : (
                      <SuccessIcon color="success" sx={{ ml: 1 }} />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Table sx={{ minWidth: 650 }} aria-label={`serviços de ${group.node}`}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Serviço</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.services.map((service) => (
                        <TableRow
                          key={service.id || service.name}
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                            cursor: 'pointer',
                          }}
                        >
                          <TableCell>{service.name}</TableCell>
                          <TableCell>{service.id || 'N/A'}</TableCell>
                          <TableCell>
                            <Typography
                              color={
                                service.status === 'critical'
                                  ? 'error'
                                  : service.status === 'warning'
                                  ? 'warning'
                                  : 'success'
                              }
                            >
                              {service.status || 'N/A'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Paper>
      </Panel>
    </PanelGroup>
  </Box>
  );
}