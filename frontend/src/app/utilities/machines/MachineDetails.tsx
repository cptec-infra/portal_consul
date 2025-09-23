'use client';

import { fetchMachineHistory, fetchPrometheusMetrics } from '@/app/api/api';
import {
  Tabs, Tab, Box, Typography, Paper, Divider, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails, Chip, Card, IconButton,
  Tooltip, Grid, Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Computer as ComputerIcon,
  Apps as ServicesIcon,
  NetworkCheck as NetworkIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Tag as TagIcon,
  Timeline as TimelineIcon,
  Build as BuildIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  DeveloperBoard as CpuIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  node: string;
  onClose?: () => void;
}

interface Machine {
  node: string;
  node_address: string;
  datacenter: string;
  services: any;
  _id?: string;
  hash?: string;
}

function diffSnapshots(prev: any, curr: any) {
  const diffs: any[] = [];

  // campos simples
  ['node', 'node_address', 'datacenter'].forEach(field => {
    if (prev[field] !== curr[field]) {
      diffs.push({
        field,
        old_value: prev[field],
        new_value: curr[field],
        action: 'Alteração'
      });
    }
  });

  // serviços
  const prevServices = Object.fromEntries((prev.services ?? []).map((s: any) => [s.id, s]));
  const currServices = Object.fromEntries((curr.services ?? []).map((s: any) => [s.id, s]));

  // removidos
  for (const id in prevServices) {
    if (!currServices[id]) {
      diffs.push({
        field: `${id}`,
        old_value: 'presente',
        new_value: 'removido',
        action: 'Remoção de serviço'
      });
    }
  }
  
  for (const id in currServices) {
    const sPrev = prevServices[id];
    const sCurr = currServices[id];
    if (!sPrev) {
      diffs.push({
        field: `Serviço ${id}`,
        old_value: 'ausente',
        new_value: 'adicionado',
        action: 'Novo serviço'
      });
    } else {
      if (sPrev.status !== sCurr.status) {
        diffs.push({
          field: `${id}`,
          old_value: sPrev.status,
          new_value: sCurr.status,
          action: 'Alteração de status'
        });
      }
      if (JSON.stringify(sPrev.tags) !== JSON.stringify(sCurr.tags)) {
        diffs.push({
          field: `${id}`,
          old_value: (sPrev.tags ?? []).join(', '),
          new_value: (sCurr.tags ?? []).join(', '),
          action: 'Alteração de tags'
        });
      }
    }
  }

  return diffs;
}

export default function MachineDetails({ node }: Props) {
  const [tab, setTab] = useState(0);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loadingMachine, setLoadingMachine] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [showIp, setShowIp] = useState(true);


  useEffect(() => {
    async function loadData() {
      setLoadingMachine(true);
      setLoadingHistory(true);
      try {
        const [prometheusData, machineHistory] = await Promise.all([
          fetchPrometheusMetrics(),
          fetchMachineHistory(node)
        ]);

        const diffsHistory: any[] = [];
        for (let i = 1; i < machineHistory.length; i++) {
          const prev = machineHistory[i];
          const curr = machineHistory[i - 1];
          const diffs = diffSnapshots(prev, curr);
          diffs.forEach(d => {
            diffsHistory.push({
              timestamp: curr.timestamp,
              node: curr.node,
              datacenter: curr.datacenter,
              services: curr.services,
              ...d
            });
          });
        }

        setMachine({ ...machineHistory[0], services: consulData });
        setHistory(diffsHistory);
      } catch (error) {
        console.log('Erro ao carregar dados da máquina:', error);
      } finally {
        setLoadingMachine(false);
        setLoadingHistory(false);
      }
    }

    loadData();
  }, [node]);

  const handleTabChange = (_: any, val: number) => {
    setTab(val);
  };

  const formatUptime = (seconds: number | null) => {
    if (seconds === null) return 'N/A';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const DetailItem = ({ label, value, icon, fullWidth = false, action }: {
    label: string;
    value: string | number | React.ReactNode;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    action?: React.ReactNode;
  }) => (
    <Card sx={{
      p: 1,
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease-in-out',
      height: '100%',
      ...(fullWidth && { gridColumn: '1 / -1' }),
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 2px 2px rgba(0,0,0,0.12)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box sx={{
          p: 0.1,
          borderRadius: 1,
          background: 'linear-gradient(12deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="body1" color="text.primary" fontWeight="200" sx={{ flex: 1, fontSize: '0.7rem' }}>
          {label}
        </Typography>
        {action}
      </Box>
      <Typography variant="h6" sx={{ fontSize: '0.9rem', wordBreak: 'break-all', lineHeight: 1.3 }} fontWeight="100" color="text.primary">
        {value === 0 ? '0' : value || '-'}
      </Typography>
    </Card>
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  if (loadingMachine || loadingHistory) {
    return (
      <Paper sx={{ mt: 4, p: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'black', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, fontSize: '0.9rem' }}>Carregando detalhes da máquina...</Typography>
      </Paper>
    );
  }

  if (!machine) {
    return (
      <Paper sx={{ mt: 4, p: 4, textAlign: 'center' }}>
        <InfoIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>Máquina não encontrada</Typography>
      </Paper>
    );
  }

  const formatBytes = (bytes) => {
    if (bytes === 0 || bytes === undefined) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper sx={{ mt: 4, p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, boxSizing: 'border-box', height: '100%' }}>
        <Tabs value={tab} onChange={handleTabChange} textColor="primary" indicatorColor="primary" sx={{ mb: 3 }}>
          <Tab label="Detalhes da Máquina" />
          <Tab label="Monitoramento" />
          <Tab label="Histórico de Alterações" />
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        {tab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ComputerIcon color="primary" sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: "0.2" }} fontWeight="100">Informações Básicas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2.5 }}>
                  <DetailItem label="Nome do Node" value={machine.node} icon={<ComputerIcon />} />
                  <DetailItem
                    label="Endereço IP"
                    value={machine?.node_address}
                    icon={<NetworkIcon />}
                    action={
                      <Tooltip title={showIp ? "Ocultar IP" : "Mostrar IP"}>
                        <IconButton size="small" onClick={() => setShowIp(!showIp)}>
                          {showIp ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <DetailItem
                    label="Cores de CPU"
                    value={machine?.services?.[0]?.metrics?.machine_cpu_cores ?? 'N/A'}
                    icon={<CpuIcon />}
                  />
                  <DetailItem
                    label="Memória"
                    value={formatBytes(machine?.services?.[0]?.metrics?.machine_memory_bytes)}
                    icon={<MemoryIcon />}
                  />
                  <DetailItem
                    label="Swap Total"
                    value={formatBytes(machine?.services?.[0]?.metrics?.machine_swap_bytes)}
                    icon={<StorageIcon />} // outro ícone para swap
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ServicesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }} fontWeight="800">Resumo dos Serviços</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 2.5,
                    mb: 2
                  }}
                >
                  <DetailItem
                    label="Total de Serviços"
                    value={`${machine?.services?.length} serviço${machine?.services?.length !== 1 ? 's' : ''}`}
                    icon={<ServicesIcon />}
                  />
                  <DetailItem
                    label="Serviços Ativos"
                    value={machine?.services?.filter(s => s.status === 'passing').length}
                    icon={<CheckCircleIcon />}
                  />
                  <DetailItem
                    label="Portas em Uso"
                    value={machine?.services?.map(s => s.port).join(', ')}
                    icon={<NetworkIcon />}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <BuildIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }} fontWeight="800">Serviços Detalhados</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2.5}>
                  {machine?.services?.map((service, index) => (
                    <Grid sx={{ xs: 12, md: 6, lg: 4 }} key={index}>
                      <ServiceCard service={service} />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ flexGrow: 1, height: '100%' }}>
            <iframe
              src={`${API_URL}/grafana/d-solo/bele8igbwfncwb/coids?orgId=1&from=1756729139872&to=1756815539872&timezone=browser&panelId=7&__feature.dashboardSceneSolo`}
              width="100%"
              height="300"
              frameBorder="0"
            />
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, fontSize: '1.3rem' }}>
              <TimelineIcon color="primary" />
              Histórico de Alterações
            </Typography>
            {history.length === 0 ? (
              <Card sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '2px dashed #cbd5e1'
              }}>
                <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '1.1rem' }}>
                  Nenhum histórico disponível
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                  Ainda não há registros de alterações para esta máquina.
                </Typography>
              </Card>
            ) : (
              history.map((entry, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <HistoryIcon color="primary" />
                    <Typography>{formatDate(entry.timestamp)}</Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{
                    backgroundColor: '#fafbfc',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                      <Card sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, fontSize: '0.9rem' }}>
                          Informações da Máquina
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            <strong>Node:</strong> {entry.node}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            <strong>Datacenter:</strong> {entry.datacenter}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            <strong>Serviços:</strong> {entry.services.map((s: any) => s.name).join(', ')}
                          </Typography>
                        </Box>
                      </Card>

                      {entry.action && (
                        <Card sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                          <Typography variant="subtitle2" color="secondary" sx={{ mb: 1, fontWeight: 600, fontSize: '0.9rem' }}>
                            Detalhes da Alteração
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              <strong>Campo alterado:</strong> {entry.field || '-'}
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ fontSize: '0.85rem' }}> 
                              <strong>Status anterior:</strong>
                              <Chip label={entry.old_value || '-'} size="small" variant="outlined" sx={{ ml: 1 }}/>
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ fontSize: '0.85rem' }}>
                              <strong> Novo status:</strong>
                              <Chip
                                label={entry.new_value || '-'}
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                          </Box>
                        </Card>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
}