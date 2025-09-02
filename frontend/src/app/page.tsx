'use client';
import { Grid, Box, Typography, Paper, Divider } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard" description="Painel geral de consumo e status das máquinas.">
      <Box sx={{
        height: 'calc(100vh - 64px)', 
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ flex: 1 }}>
          <iframe
            src={`${API_URL}/grafana/d-solo/bele8igbwfncwb/coids?orgId=1&from=1756729139872&to=1756815539872&timezone=browser&panelId=7&__feature.dashboardSceneSolo`}
            style={{
              border: 'none',
              width: '100%',
              height: '100%',
            }}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </Box>
      </Box>
    </PageContainer>
  )
}
