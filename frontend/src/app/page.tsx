'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
// componentes existentes
import SalesOverview from '@/app/components/dashboard/SalesOverview';
// futuros componentes sugeridos (você pode criar depois):
// import MachineSummary from '@/app/components/dashboard/MachineSummary';
// import Alerts from '@/app/components/dashboard/Alerts';
// import ActivityUptime from '@/app/components/dashboard/ActivityUptime';
// import SystemStatus from '@/app/components/dashboard/SystemStatus';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="Painel geral de consumo e status das máquinas.">
      <Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <SalesOverview />
          </Grid>

          {/* <Grid size={{ xs: 12, lg: 4 }}> */}
            {/* <Grid container spacing={3}> */}
              {/* <Grid size={12}> */}
                {/* <MachineSummary /> */}
              {/* </Grid> */}
              {/* <Grid size={12}> */}
                {/* <ActivityUptime /> */}
              {/* </Grid> */}
            {/* </Grid> */}
          {/* </Grid> */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <SalesOverview />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            {/* <Alerts /> */}
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            {/* <SystemStatus /> */}
          </Grid>
        </Grid>

      </Box>
    </PageContainer>
  );
};

export default Dashboard;
