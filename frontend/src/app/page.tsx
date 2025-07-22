'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
// components
import SalesOverview from '@/app/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/components/dashboard/ProductPerformance';
import Blog from '@/app/components/dashboard/Blog';
import MonthlyEarnings from '@/app/components/dashboard/MonthlyEarnings';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <SalesOverview />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <YearlyBreakup />
              </Grid>
              <Grid size={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <RecentTransactions />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <ProductPerformance />
          </Grid>
          <Grid size={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
