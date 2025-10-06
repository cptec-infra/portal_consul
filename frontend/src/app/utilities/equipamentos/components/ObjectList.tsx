'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Equipment } from '../types';
import { fetchEquipments, exportEquipmentsToXLSX } from '@/app/api/racktables/apiRackTables';

interface ObjectListProps {
  onSelectEquipment: (id: number) => void;
}

export default function ObjectList({ onSelectEquipment }: ObjectListProps) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const getEquipments = async () => {
      try {
        const data = await fetchEquipments();
        setEquipments(data);
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
      } finally {
        setLoading(false);
      }
    };
    getEquipments();
  }, []);

  const handleExportXLSX = async () => {
    setExportLoading(true);
    try {
      const blob = await exportEquipmentsToXLSX();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'equipamentos.xlsx');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando equipamentos...</Typography>
      </Box>
    );
  }

  const uniqueEquipmentCount = new Set(equipments.map(obj => obj.id)).size;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Todos os equipamentos - {uniqueEquipmentCount}
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ 
              background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)' 
            }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Localização</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Racks</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asset No.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipments.map((equipment) => (
              <TableRow
                key={equipment.id}
                onClick={() => onSelectEquipment(equipment.id)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                    '& td': { color: 'white' }
                  },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">
                    {equipment.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {equipment.location_names || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {equipment.rack_names || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Tipo {equipment.objtype_id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {equipment.asset_no || 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}