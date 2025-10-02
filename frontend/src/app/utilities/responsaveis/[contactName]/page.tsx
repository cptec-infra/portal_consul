'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ContactEquipment } from '../types';
import { fetchContactEquipments } from '@/app/api/racktables/apiRackTables';

interface ContactDetailPageProps {
  params: Promise<{ contactName: string }>;
}

export default function ContactDetailPage({ params }: ContactDetailPageProps) {
  const router = useRouter();
  const [equipments, setEquipments] = useState<ContactEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contactName } = use(params);
  const decodedContactName = decodeURIComponent(contactName);

  useEffect(() => {
    const getContactEquipments = async () => {
      try {
        const data = await fetchContactEquipments(decodedContactName);
        setEquipments(data);
      } catch (err) {
        console.error('Erro ao carregar equipamentos do contato:', err);
        setError('Erro ao carregar equipamentos do responsável. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    getContactEquipments();
  }, [decodedContactName]);

  const onBack = () => router.back();
  
  const handleSelectEquipment = (equipmentId: number) => {
    router.push(`/utilities/equipamentos/${equipmentId}`);
  };

  const getEquipmentType = (typeId: number) => {
    return typeId === 4 ? 'Servidor' : 'Equipamento de Rede';
  };

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={onBack} variant="contained">
          Voltar
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Carregando equipamentos de {decodedContactName}...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3, minHeight: '100vh' }}>
      <Button 
        variant="contained" 
        onClick={onBack}
        sx={{ textTransform: 'none', mb: 3 }}
      >
        ← Voltar
      </Button>

      <Typography variant="h4" component="h1" sx={{ mb: 2, color: '#2c3e50' }}>
        Equipamentos do responsável: {decodedContactName}
      </Typography>
      
      <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 4 }}>
        <strong>Total de equipamentos:</strong> {equipments.length}
      </Typography>

      {equipments.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)' 
              }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asset No.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.map((equipment) => (
                <TableRow
                  key={equipment.id}
                  onClick={() => handleSelectEquipment(equipment.id)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {equipment.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getEquipmentType(equipment.objtype_id)}
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
      ) : (
        <Typography sx={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center', mt: 4 }}>
          Nenhum equipamento encontrado para este responsável.
        </Typography>
      )}
    </Box>
  );
}