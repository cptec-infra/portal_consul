'use client';
import { Grid, Box, Typography, Paper, Divider } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PageContainer from '@/app/components/container/PageContainer';
import CpuUsageChart from './components/charts/CpuUsageChart';
import RamUsageChart from './components/charts/RamUsageChart';
import MachineTable from './components/charts/MachineTable';
import AlertsTable from './components/charts/AlertsTable';
import UserSessions from './components/charts/UserSessions';

const machineStatusData = [
  { name: 'Rodando', value: 80, color: '#4CAF50' },
  { name: 'Parado', value: 32, color: '#FFC107' },
  { name: 'Erro', value: 20, color: '#F44336' },
];

const stats = [
  { label: 'Total de Máquinas', value: 114 },
  { label: 'Total de Serviços', value: 343 },
  { label: 'Fora do ar', value: 20, color: '#F44336' },
];

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard" description="Painel geral de consumo e status das máquinas.">
      <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid sx={{ xs: 12, sm: 4 }} key={index}>
              <Paper elevation={1} sx={{ padding: 4, textAlign: 'center' }}>
                <Typography variant="h6">{stat.label}</Typography>
                <Typography variant="h4" sx={{ color: stat.color || 'primary.main' }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid> */}

        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6" gutterBottom>
              Consumo CPU (Grafana)
            </Typography>

            <Box sx={{ flex: 1 }}>
              {/* <iframe 
                  src="http://grafana.coids.inpe.br//d-solo/bele8igbwfncwb/coids?orgId=1&from=1756227236562&to=1756313636562&timezone=browser&panelId=7&__feature.dashboardSceneSolo" 
                  width="100%"
                  height="300"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  /> */}

                {/* <iframe src="http://150.163.212.76:9090" width="720" height="480" frameborder="0"></iframe> */}

                <iframe
                  src="https://observablehq.com/embed/@d3/bar-chart?cell=chart"
                  width="100%"
                  height="400"
                  frameBorder="0"
                />
            </Box>
          </Paper>
        </Grid>


        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid sx={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Typography variant="h6" gutterBottom>
                Status das Máquinas ativas
              </Typography>
              <ResponsiveContainer width="100%" height={300} >
                <PieChart>
                  <Pie
                    data={machineStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                  >
                    {machineStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid sx={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Informações adicionais
              </Typography>
              <Typography variant="body2">
                Você pode adicionar uptime, alertas, logs, etc. aqui.
              </Typography>
            </Paper>
          </Grid>
          <Grid sx={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <AlertsTable />
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </PageContainer>
  );
}
