'use client';

import { Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'hostname', headerName: 'Hostname', flex: 1 },
  { field: 'ip', headerName: 'IP', flex: 1 },
  { field: 'status', headerName: 'Status', width: 120 },
];

const rows = [
  { id: 1, hostname: 'srv-web-01', ip: '192.168.0.1', status: 'Online' },
  { id: 2, hostname: 'srv-db-01', ip: '192.168.0.2', status: 'Offline' },
  { id: 3, hostname: 'srv-cache', ip: '192.168.0.3', status: 'Online' },
];

export default function MachineTable() {
  return (
    <>
      <Typography variant="h6" gutterBottom>Servidores</Typography>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick
      />
    </>
  );
}
