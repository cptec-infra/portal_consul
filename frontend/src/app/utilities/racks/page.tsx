'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import RackListComponent from './components/RackList';

export default function RacksPage() {
  const router = useRouter();
  const handleSelectRack = (id: number) => {
    router.push(`/utilities/racks/${id}`);
  };

  return (
    <Box>
      <RackListComponent onSelectRack={handleSelectRack} />
    </Box>
  );
}