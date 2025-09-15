'use client';

import { fetchMachineHistory, fetchMachineFromConsul } from '@/app/api/api';
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
  Tag as TagIcon,
  Timeline as TimelineIcon,
  Build as BuildIcon,
  Fingerprint as FingerprintIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface Props {
  node: string;
  onClose?: () => void;
}

interface Machine {
  node: string;
  node_address: string;
  datacenter: string;
  services: any[];
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
  const [showId, setShowId] = useState(false);
  const [showIp, setShowIp] = useState(false);


  useEffect(() => {
    async function loadData() {
      setLoadingMachine(true);
      setLoadingHistory(true);
      try {
        const [consulData, machineHistory] = await Promise.all([
          fetchMachineFromConsul(node),
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
        console.error('Erro ao carregar dados da máquina:', error);
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
        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
        <Box sx={{
          p: 0.7,
          borderRadius: 2,
          background: 'linear-gradient(12deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="body1" color="text.secondary" fontWeight="600" sx={{ flex: 1, fontSize: '0.9rem' }}>
          {label}
        </Typography>
        {action}
      </Box>
      <Typography variant="h6" sx={{ fontSize: '0.9rem' }} fontWeight="700" color="text.primary" sx={{
        wordBreak: 'break-all',
        lineHeight: 1.3,
        fontSize: '0.9rem'
      }}>
        {value === 0 ? '0' : value || '-'}
      </Typography>
    </Card>
  );

  const getStatusColorCard = (status: string) => {
      switch (status) {
        case 'passing': return '#7edfbeff';
        case 'warning': return '#ddaf60ff';
        case 'critical': return '#db6c6cff';
        default: return 'default';
      }
    };

  const ServiceCard = ({ service }: { service: any }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'passing': return 'success';
        case 'warning': return 'warning';
        case 'critical': return 'error';
        default: return 'default';
      }
    };
    return (
      <Card sx={{
        p: 2.5,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          borderColor: '#667eea'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${getStatusColor(service.status) === 'success' ? '#10b981, #059669' : '#f59e0b, #d97706'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <ServicesIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '0.9rem' }} fontWeight="700" color="text.primary" sx={{ fontSize: '1.1rem' }}>
              {service.name}
            </Typography>
            <Chip
              icon={<CheckCircleIcon />}
              label={service.status}
              color={getStatusColor(service.status) as any}
              size="small"
              variant="filled"
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid sx={{ xs: 4 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ fontSize: '0.75rem' }}>
              TAGS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
              {service.tags && service.tags.length > 0 ? (
                service.tags.map((tag: string, tagIndex: number) => (
                  <Chip
                    key={tagIndex}
                    icon={<TagIcon />}
                    label={tag}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  Nenhuma tag
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid sx={{ xs: 4 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ fontSize: '0.75rem' }}>
              HEALTH CHECK
            </Typography>
            {service?.output && service?.output.length > 0 ? (
              <Stack spacing={1} sx={{ mt: 1 }}>
                {
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: getStatusColorCard(service.status),
                      borderRadius: 1,
                      border: getStatusColor(service.status) as any,
                    }}
                  >
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5, fontSize: '0.85rem' }}>
                      Output
                    </Typography>
                    <Typography variant="body2" color='#000000ff' sx={{ fontSize: '0.85rem' }}>
                      {(service?.output?.length ?? 0) > 50
                        ? service.output.slice(0, 71) + '...'
                        : service.output || 'Sem dados'}
                    </Typography>

                  </Box>
                }
              </Stack>


            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                Nenhum check
              </Typography>
            )}
          </Grid>
          <Grid sx={{ xs: 12 }}>

          </Grid>
        </Grid>
      </Card>
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  if (loadingMachine) {
    return (
      <Paper sx={{ mt: 4, p: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'black', mb: 2 }} />
        <Typography variant="h6" sx={{ fontSize: '0.9rem' }} sx={{ mb: 1 }}>Carregando detalhes da máquina...</Typography>
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
    <Paper sx={{ mt: 4, p: 4 }}>
      <Box>
        <Tabs value={tab} onChange={handleTabChange} textColor="primary" indicatorColor="primary" sx={{ mb: 3 }}>
          <Tab label="Detalhes da Máquina" />
          <Tab label="Histórico de Alterações" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {tab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ComputerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }} fontWeight="800">Informações Básicas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2.5 }}>
                  <DetailItem label="Nome do Node" value={machine.node} icon={<ComputerIcon />} />
                  <DetailItem label="Datacenter" value={machine.datacenter} icon={<DatacenterIcon />} />
                  <DetailItem
                    label="Endereço IP"
                    value={showIp ? machine.node_address : '•••.•••.•••.•••'}
                    icon={<NetworkIcon />}
                    action={
                      <Tooltip title={showIp ? "Ocultar IP" : "Mostrar IP"}>
                        <IconButton size="small" onClick={() => setShowIp(!showIp)}>
                          {showIp ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <DetailItem
                    label="ID da Máquina"
                    value={showId ? machine._id || 'N/A' : '••••••••••••••••••••••••'}
                    icon={<FingerprintIcon />}
                    action={
                      <Tooltip title={showId ? "Ocultar ID" : "Mostrar ID"}>
                        <IconButton size="small" onClick={() => setShowId(!showId)}>
                          {showId ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <DetailItem
                    label="Hash de Configuração"
                    value={machine.hash ? `${machine.hash.substring(0, 16)}...` : 'N/A'}
                    icon={<SecurityIcon />}
                    fullWidth
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                <Accordion
                  key={index}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    '&:before': { display: 'none' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&.Mui-expanded': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      minHeight: 64,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                      },
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <HistoryIcon color="primary" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="600" color="text.primary" sx={{ fontSize: '0.95rem' }}>
                          {formatDate(entry.timestamp)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          Clique para ver detalhes da alteração
                        </Typography>
                      </Box>
                      {entry.action && (
                        <Chip
                          icon={<EditIcon />}
                          label={entry.action}
                          color="primary"
                          variant="filled"
                          size="small"
                          sx={{
                            fontWeight: 600,
                            '& .MuiChip-icon': { fontSize: 16 }
                          }}
                        />
                      )}
                    </Box>
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
                              <strong>Valor anterior:</strong>
                              <Chip label={entry.old_value || '-'} size="small" variant="outlined" sx={{ ml: 1 }}/>
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ fontSize: '0.85rem' }}>
                              <strong>Novo valor:</strong>
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
