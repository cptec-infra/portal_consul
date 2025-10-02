'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import ContactList from './components/ContactList';

export default function ResponsaveisPage() {
  const router = useRouter();

  const handleSelectContact = (contactName: string) => {
    router.push(`/utilities/responsaveis/${encodeURIComponent(contactName)}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ContactList onSelectContact={handleSelectContact} />
    </Box>
  );
}