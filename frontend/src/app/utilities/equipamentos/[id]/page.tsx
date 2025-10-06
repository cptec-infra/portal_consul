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
  Paper
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { 
  fetchEquipmentDetails, 
  EquipmentDetails, 
  EquipmentAttribute, 
  EquipmentPort 
} from '@/app/api/racktables/apiRackTables';

interface EquipmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EquipmentDetailPage({ params }: EquipmentDetailPageProps) {
  const router = useRouter();
  const [equipment, setEquipment] = useState<EquipmentDetails | null>(null);
  const [attributes, setAttributes] = useState<EquipmentAttribute[]>([]);
  const [ports, setPorts] = useState<EquipmentPort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = use(params);

  useEffect(() => {
    const getEquipmentDetails = async () => {
      try {
        const data = await fetchEquipmentDetails(id);
        setEquipment(data.object);
        setAttributes(data.attributes);
        setPorts(data.ports);
      } catch (err) {
        console.error('Erro ao carregar equipamento:', err);
        setError('Erro ao carregar o equipamento. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    getEquipmentDetails();
  }, [id]);

  const onBack = () => router.back();

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }}>Voltar</Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando equipamento...</Typography>
      </Box>
    );
  }

  if (!equipment) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Equipamento não encontrado</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }}>Voltar</Button>
      </Box>
    );
  }

  const getEquipmentType = (typeId: number) => {
    return typeId === 4 ? 'Servidor' : 'Equipamento de Rede';
  };

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3, minHeight: '100vh' }}>
      <Button 
        variant="contained" 
        onClick={onBack}
        sx={{ textTransform: 'none', mb: 3 }}
      >
        ← Voltar para lista de equipamentos
      </Button>

      <Typography variant="h4" component="h1" sx={{ mb: 2, color: '#2c3e50' }}>
        {equipment.name}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 1 }}>
          <strong>ID:</strong> {equipment.id}
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
          <strong>Tipo:</strong> {getEquipmentType(equipment.objtype_id)}
        </Typography>
      </Box>

      {/* Atributos */}
      <Typography variant="h5" component="h2" sx={{ mb: 2, color: '#2c3e50', borderBottom: '2px solid #ecf0f1', pb: 1 }}>
        Atributos
      </Typography>
      
      {attributes.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Atributo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes.map((attr, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(even)': { backgroundColor: '#f8f9fa' },
                    '&:hover': { backgroundColor: '#e3f2fd' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {attr.attribute_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {attr.attribute_value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ mb: 4, color: '#7f8c8d', fontStyle: 'italic' }}>
          Nenhum atributo encontrado para este equipamento.
        </Typography>
      )}

      {/* Portas de Rede */}
      <Typography variant="h5" component="h2" sx={{ mb: 2, color: '#2c3e50', borderBottom: '2px solid #ecf0f1', pb: 1 }}>
        Portas de Rede
      </Typography>
      
      {ports.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IP</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ports.map((port, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(even)': { backgroundColor: '#f8f9fa' },
                    '&:hover': { backgroundColor: '#e3f2fd' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {port.port_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {port.port_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {port.port_label || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {port.port_state}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ color: '#7f8c8d', fontStyle: 'italic' }}>
          Nenhuma porta de rede encontrada para este equipamento.
        </Typography>
      )}
    </Box>
  );
}