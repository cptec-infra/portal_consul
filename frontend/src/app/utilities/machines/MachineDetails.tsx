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
  Storage as DatacenterIcon,
  Apps as ServicesIcon,
  NetworkCheck as NetworkIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Tag as TagIcon,
  Timeline as TimelineIcon,
  Memory as MemoryIcon,
  Build as BuildIcon,
  Fingerprint as FingerprintIcon,
  AccessTime as AccessTimeIcon,
  Storage as DiskIcon,
  SettingsApplications as ProcessesIcon,
  BarChart as MetricsIcon,
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

export default function MachineDetails({ node }: Props) {
  const [tab, setTab] = useState(0);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loadingMachine, setLoadingMachine] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [showId, setShowId] = useState(false);
  const [showIp, setShowIp] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoadingMachine(true);
      setLoadingHistory(true);
      try {
        const [prometheusData, machineHistory] = await Promise.all([
          fetchPrometheusMetrics(),
          fetchMachineHistory(node)
        ]);
        const updatedHistory = machineHistory.map((historyEntry: object) => ({
          ...historyEntry,
          services: prometheusData
        }));

        const machineData = { ...updatedHistory[0] };
        setMachine(machineData);
        setHistory(updatedHistory);

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
                  <DetailItem label="Datacenter" value={machine.datacenter} icon={<DatacenterIcon />} />
                  <DetailItem
                    label="Endereço IP"
                    value={machine?.node_address}
                    icon={<NetworkIcon />}
                  />
                  <DetailItem
                    label="ID da Máquina"
                    value={machine?._id}
                    icon={<FingerprintIcon />}
                  />
                  <DetailItem
                    label="Hash de Configuração"
                    value={machine?.hash}
                    icon={<SecurityIcon />}
                    fullWidth
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            {machine?.services && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <MetricsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography sx={{ fontSize: "0.2" }} fontWeight="100">Métricas do Sistema</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2.5 }}>
                    <DetailItem
                      label="Uso de CPU"
                      value={machine.services.cpu_usage !== null ? `${machine.services.cpu_usage.toFixed(2)}%` : 'N/A'}
                      icon={<SpeedIcon />}
                    />
                    <DetailItem
                      label="Uso de Memória"
                      value={machine.services.memory_usage !== null ? `${machine.services.memory_usage.toFixed(2)}%` : 'N/A'}
                      icon={<MemoryIcon />}
                    />
                    <DetailItem
                      label="Tempo de Atividade"
                      value={formatUptime(machine?.services?.uptime_seconds)}
                      icon={<AccessTimeIcon />}
                    />
                    <DetailItem
                      label="Uso de Disco"
                      value={machine?.services?.disk_usage ? 'Dados Disponíveis' : 'N/A'}
                      icon={<DiskIcon />}
                    />
                    <DetailItem
                      label="Processos em Execução"
                      value={machine?.services?.running_processes ? 'Dados Disponíveis' : 'N/A'}
                      icon={<ProcessesIcon />}
                    />
                    <DetailItem
                      label="Portas Abertas"
                      value={machine?.services?.open_ports?.length ?? 'N/A'}
                      icon={<NetworkIcon />}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
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
                  <AccordionDetails>
                    <Typography>Node: {entry.node}</Typography>
                    <Typography>Datacenter: {entry.datacenter}</Typography>
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