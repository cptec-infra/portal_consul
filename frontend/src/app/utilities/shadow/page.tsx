'use client';
import { useEffect, useState } from 'react';
import { Paper, Box, Grid, Typography, CircularProgress } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import api from '@/app/api/api';

interface Servico {
  id: number;
  nome: string;
  status: string;
  descricao?: string;
}

const Shadow = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        console.log('entramos?')
        const response = await api.get('/servicos/');
        setServicos(response.data);
      } catch (err: any) {
        console.log('Erro ao buscar serviços:', err);
        setError('Erro ao carregar os serviços');
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  return (
    <PageContainer title="Serviços" description="Listagem de serviços do sistema">
      <DashboardCard title="Serviços Registrados">
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={2}>
            {servicos.map((servico) => (
              <Grid size={{ xs: 12, sm: 6, md: 4}} key={servico.id}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6">{servico.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {servico.status}
                  </Typography>
                  {servico.descricao && (
                    <Typography variant="body2" mt={1}>
                      {servico.descricao}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default Shadow;
