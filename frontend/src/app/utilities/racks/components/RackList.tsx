'use client';

import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { Racks } from '../types';
import { fetchRacks, exportRacksToXLSX } from '@/app/api/racktables/apiRackTables';

function RackList({ onSelectRack }: { onSelectRack: (id: number) => void }) {
  const [racks, setRacks] = useState<Racks[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const getRacks = async () => {
      try {
        const data = await fetchRacks();
        setRacks(data);
      } catch (error) {
        console.error("Erro ao carregar racks:", error);
      } finally {
        setLoading(false);
      }
    };
    getRacks();
  }, []);

  const handleExportXLSX = async () => {
    setExportLoading(true);
    try {
      const blob = await exportRacksToXLSX();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'racks.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao exportar XLSX:', error);
      alert('Erro ao exportar arquivo. Tente novamente.');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Racks do Data Center
        </Typography>
        <Button
          variant="contained"
          onClick={handleExportXLSX}
          disabled={exportLoading}
          sx={{ textTransform: 'none' }}
        >
          {exportLoading ? <CircularProgress size={24} /> : 'Exportar XLSX'}
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
        {racks.map((rack: any) => (
          <Paper
            key={rack.id}
            onClick={() => onSelectRack(rack.id)}
            sx={{
              p: 2,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Typography variant="h6">{rack.name}</Typography>
            <Typography variant="body2" color="text.secondary">Localização: {rack.location_name}</Typography>
            <Typography variant="body2" color="text.secondary">Altura: {rack.height}U</Typography>
            <Typography variant="body2" color="text.secondary">Equipamentos: {rack.object_count}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default RackList;