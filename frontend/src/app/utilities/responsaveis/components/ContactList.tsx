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
  TableRow,
  Alert
} from '@mui/material';
import { Contact, ContactEquipmentCount } from '../types';
import { fetchContacts, fetchContactEquipments, exportContactsToXLSX } from '@/app/api/racktables/apiRackTables';

interface ContactListProps {
  onSelectContact: (contactName: string) => void;
}

export default function ContactList({ onSelectContact }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [equipmentCounts, setEquipmentCounts] = useState<ContactEquipmentCount>({});
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getContacts = async () => {
      try {
        setLoading(true);
        const contactsData = await fetchContacts();
        setContacts(contactsData);

        // Buscar contagem de equipamentos para cada contato
        const counts: ContactEquipmentCount = {};
        for (const contact of contactsData) {
          try {
            const equipments = await fetchContactEquipments(contact.contact_name);
            counts[contact.contact_name] = equipments.length;
          } catch (err) {
            console.error(`Erro ao buscar equipamentos para ${contact.contact_name}:`, err);
            counts[contact.contact_name] = 0;
          }
        }
        setEquipmentCounts(counts);

      } catch (err) {
        console.error('Erro ao carregar contatos:', err);
        setError('Erro ao carregar responsáveis. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, []);

  const handleExportXLSX = async () => {
    setExportLoading(true);
    try {
      const blob = await exportContactsToXLSX();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'responsaveis.xlsx');
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
        <Typography sx={{ ml: 2 }}>Carregando responsáveis...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => window.location.reload()} variant="contained">
          Tentar Novamente
        </Button>
      </Box>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Nenhum responsável encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Todos os contatos - {contacts.length}
        </Typography>
        {/* <Button
          variant="contained"
          onClick={handleExportXLSX}
          disabled={exportLoading}
          sx={{ textTransform: 'none' }}
        >
          {exportLoading ? <CircularProgress size={24} /> : 'Exportar XLSX'}
        </Button> */}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow sx={{ 
              background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)' 
            }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '60%' }}>Nome</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '40%' }}>Total de Equipamentos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow
                key={contact.id}
                onClick={() => onSelectContact(contact.contact_name)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#a4cbf1',
                  },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">
                    {contact.contact_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {equipmentCounts[contact.contact_name] !== undefined 
                      ? equipmentCounts[contact.contact_name]
                      : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Carregando...
                        </Box>
                      )
                    }
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