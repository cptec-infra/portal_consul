'use client';

import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Box
} from '@mui/material';


const alerts = [
  { id: 1, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 2, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 3, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 4, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 5, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 6, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 7, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 8, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 9, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 10, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 11, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 12, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 13, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 14, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 15, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 16, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 17, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 18, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
  { id: 19, level: 'Crítico', message: 'Servidor srv-db-01 fora do ar' },
  { id: 20, level: 'Aviso', message: 'CPU acima de 80% no srv-web-01' },
];

export default function AlertsTable() {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Alertas Recentes
      </Typography>
      
      <Box
        sx={{
          maxHeight: 300,
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: 1,
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nível</TableCell>
              <TableCell>Mensagem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map(alert => (
              <TableRow key={alert.id}>
                <TableCell>{alert.id}</TableCell>
                <TableCell>{alert.level}</TableCell>
                <TableCell>{alert.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}


