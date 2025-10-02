'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import ObjectList from './components/ObjectList';

export default function EquipamentosPage() {
  const router = useRouter();

  const handleSelectEquipment = (id: number) => {
    router.push(`/utilities/equipamentos/${id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ObjectList onSelectEquipment={handleSelectEquipment} />
    </Box>
  );
}