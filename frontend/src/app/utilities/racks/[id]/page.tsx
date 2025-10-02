'use client';

import React, { useEffect, useState } from "react";
import { use } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { fetchRackDetails, RackDetails, RackObject } from '@/app/api/racktables/apiRackTables';
import { useRouter } from 'next/navigation';

interface RackDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function RackDetailsPage({ params }: RackDetailsPageProps) {
  const router = useRouter();
  const [rack, setRack] = useState<RackDetails | null>(null);
  const [objects, setObjects] = useState<RackObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = use(params);

  useEffect(() => {
    const getRackDetails = async () => {
      try {
        const data = await fetchRackDetails(id);
        setRack(data.rack);
        setObjects(data.objects || []);
      } catch (err) {
        console.error("Erro ao carregar rack:", err);
        setError("Erro ao carregar o rack. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    getRackDetails();
  }, [id]);

  const onBack = () => router.push('/utilities/racks');

  const handleSelectEquipment = (equipmentId: number) => {
    router.push(`/utilities/equipamentos/${equipmentId}`);
  };

  const getAtomPosition = (atom: number | null) => {
    if (atom === null) return 'N/A';
    const positions: { [key: number]: string } = {
      1: 'Esq', 2: 'Centro', 3: 'Dir', 4: 'Esq-Ctrl', 5: 'Dir-Ctrl'
    };
    return positions[atom] || `Pos ${atom}`;
  };

  const getStateBadge = (state: string) => {
    const states: { [key: string]: { text: string; styles: object } } = {
      'A': { text: 'Ativo', styles: { bgcolor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' } },
      'U': { text: 'Desconhecido', styles: { bgcolor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' } },
      'D': { text: 'Desativado', styles: { bgcolor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' } },
      '': { text: 'N/A', styles: { bgcolor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' } }
    };
    const stateInfo = states[state] || states[''];
    
    return (
      <Box component="span" sx={{
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '9px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        position: 'absolute',
        top: '5px',
        right: '8px',
        ...stateInfo.styles
      }}>
        {stateInfo.text}
      </Box>
    );
  };

  const rackHeight = rack?.height || 42;
  const rackSlots = Array.from({ length: rackHeight }, (_, i) => {
    const slotNumber = rackHeight - i;
    const obj = objects.find(o => o.unit_no === slotNumber);
    return { slot: slotNumber, object: obj, atom: obj?.atom, state: obj?.state };
  });

  const uniqueObjects = objects.filter((obj, index, self) =>
    index === self.findIndex((t) => t.id === obj.id)
  );

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
      </Box>
    );
  }

  if (!rack) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Rack não encontrado.</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }}>Voltar</Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button variant="contained" onClick={onBack} sx={{ textTransform: 'none' }}>
          ← Voltar para lista de racks
        </Button>
      </Box>
      <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.100', borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
          Rack: {rack.name}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="caption" display="block" color="text.secondary">Localização</Typography>
            <Typography variant="body1" fontWeight="bold">{rack.location_name || 'Não especificado'}</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="caption" display="block" color="text.secondary">Row</Typography>
            <Typography variant="body1" fontWeight="bold">{rack.row_name || 'Não especificado'}</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="caption" display="block" color="text.secondary">Altura</Typography>
            <Typography variant="body1" fontWeight="bold">{rack.height}U</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="caption" display="block" color="text.secondary">Equipamentos</Typography>
            <Typography variant="body1" fontWeight="bold">{uniqueObjects.length} instalados</Typography>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="h5" component="h3" sx={{ textAlign: 'center', mb: 3 }}>
          Visualização do Rack ({rack.height}U)
        </Typography>
        <Box sx={{ border: '3px solid #2c3e50', borderRadius: 2, width: '420px', margin: '0 auto', overflowY: 'auto', maxHeight: '600px', bgcolor: 'white' }}>
          {rackSlots.map((slot, index) => (
            <Box
              key={index}
              onClick={() => slot.object && handleSelectEquipment(slot.object.id)} // ✅ ADICIONE ONCLICK AQUI
              sx={{
                minHeight: '70px',
                borderBottom: '1px solid #dee2e6',
                display: 'flex',
                alignItems: 'stretch',
                p: 0,
                cursor: slot.object ? 'pointer' : 'default',
                bgcolor: slot.object ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' : '#f8f9fa',
                borderLeft: slot.object ? '4px solid #2196f3' : 'none',
                '&:hover': slot.object ? {
                  bgcolor: 'linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  zIndex: 2,
                } : {},
              }}
            >
              <Box sx={{ width: '60px', fontSize: '12px', color: '#6c757d', fontWeight: 'bold', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.9)', p: '10px 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #dee2e6', flexShrink: 0 }}>
                {slot.slot}U
              </Box>
              {slot.object ? (
                <Box sx={{ flex: 1, p: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                  <Typography variant="body2" component="strong" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: '4px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={slot.object.name}>
                    {slot.object.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <Typography variant="body2" sx={{ fontSize: '10px', color: '#6c757d' }}>Asset: {slot.object.asset_no || 'N/A'}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '10px', color: '#6c757d' }}>Pos: {getAtomPosition(slot.object.atom)}</Typography>
                  </Box>
                  {getStateBadge(slot.object.state)}
                </Box>
              ) : (
                <Typography sx={{ color: '#adb5bd', fontStyle: 'italic', fontSize: '12px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: '10px' }}>
                  Slot vazio
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {uniqueObjects.length > 0 && (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h5" component="h3" sx={{ textAlign: 'center', mb: 3 }}>
            Lista de Equipamentos ({uniqueObjects.length})
          </Typography>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <Box component="th" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', bgcolor: 'grey.200' }}>Unit</Box>
                <Box component="th" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', bgcolor: 'grey.200' }}>Nome</Box>
                <Box component="th" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', bgcolor: 'grey.200' }}>Asset</Box>
                <Box component="th" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', bgcolor: 'grey.200' }}>Posição</Box>
                <Box component="th" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', bgcolor: 'grey.200' }}>Estado</Box>
                <Box component="th" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', bgcolor: 'grey.200' }}>Tipo</Box>
              </tr>
            </thead>
            <tbody>
              {uniqueObjects.map(obj => (
                <Box
                  component="tr"
                  key={obj.id}
                  onClick={() => handleSelectEquipment(obj.id)} 
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { 
                      bgcolor: 'action.hover',
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  <Box component="td" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography component="strong" variant="body2">{obj.unit_no}U</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">{obj.name}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">{obj.asset_no || 'N/A'}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">{getAtomPosition(obj.atom)}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    {getStateBadge(obj.state)}
                  </Box>
                  <Box component="td" sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">Tipo {obj.objtype_id}</Typography>
                  </Box>
                </Box>
              ))}
            </tbody>
          </Box>
        </Box>
      )}
    </Box>
  );
}