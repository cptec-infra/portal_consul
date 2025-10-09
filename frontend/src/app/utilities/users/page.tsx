'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { fetchUsers } from '@/app/api/api';
import { useSelector } from 'react-redux';
import { User } from './types';
import UserDetails from './UserDetails';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);


  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();

        const list = Array.isArray(data) ? data : [];
        const normalized: User[] = list.map((u: any) => ({
          uid: String(u.uid || '-'),
          mail: String(u.mail || '-'),
          uidNumber: String(u.uidnumber || '-'),
          title: String(u.title || '-'),
          firstname: String(u.firstname || '-'),
          lastname: String(u.lastname || '-'),
          name: `${u.firstname ?? '-'} ${u.lastname ?? '-'}`.trim(),
          passwordExpiration: String(u.passwordexpiration || '-'),
          homeDirectory: String(u.homedirectory || '-'),
          macs: Array.isArray(u.macs) ? u.macs : [],
          memberOfGroup: Array.isArray(u.memberof_group) ? u.memberof_group : [],
          telephoneNumber: Array.isArray(u.telephonenumber)
            ? u.telephonenumber[0]
            : u.telephonenumber || '',
        }));

        setUsers(normalized);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: 'uidNumber', headerName: 'ID', flex: 0 },
    { field: 'uid', headerName: 'Usuário', flex: 1 },
    { field: 'name', headerName: 'Nome', flex: 3 },
    { field: 'mail', headerName: 'Email', flex: 1.25 },
    { field: 'title', headerName: 'Vínculo', flex: 1 },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PanelGroup direction="vertical" style={{ flex: 1 }}>
        <Panel defaultSize={60} minSize={20}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: '99%', 
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#1e1e1e' : '#fafafa',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
		rows={users}
                columns={columns}
                getRowId={(row) => row.uid}
                onRowClick={(params) => setSelectedUser(params.row)}
                sx={{
                  border: 'none',
                  height: '100%',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(224, 224, 224, 0.2)',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    fontWeight: 'bold',
                  },
                }}
              />
            )}
          </Paper>
        </Panel>

        <PanelResizeHandle
          style={{
            height: '6px',
            background: '#ccc',
            cursor: 'row-resize',
          }}
        />

        <Panel defaultSize={50} minSize={20}>
          {selectedUser ? (
            <Paper
              elevation={2}
              sx={{
                p: 0,
                height: '100%',
                borderRadius: 2,
                overflow: 'auto',
                mt: 0,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2e2e2e' : '#fff',
              }}
            >
              <UserDetails
                user={selectedUser || ''}
                onClose={() => setSelectedUser(null)}
              />
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 2,
                mt: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2e2e2e' : '#fff',
              }}
            >
              <Typography variant="body1">
                Selecione o usuário para ver os detalhes.
              </Typography>
            </Paper>
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
}
