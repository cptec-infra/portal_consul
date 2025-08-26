'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { fetchUsers } from '@/app/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/store/store';
import { User } from './types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const searchTerm = useSelector((state: RootState) => state.search.value);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();

        const list = Array.isArray(data?.usuarios) ? data.usuarios : [];
        const normalized: User[] = list.map((u: any) => ({
          uid: String(u.uid || '-'),
          mail: String(u.mail || '-'),
          uidNumber: String(u.uidnumber || '-'),
          title: String(u.title || '-'),
          firstname: String(u.firstname || '-'),
          lastname: String(u.lastname || '-'),
          name: `${u.firstname ?? '-'} ${u.lastname ?? '-'}`.trim(),
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

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const q = searchTerm.toLowerCase();
    return users.filter((u) =>
      [u.uid, u.mail, u.uidNumber, u.title].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [users, searchTerm]);

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
        <Panel defaultSize={30} minSize={20}>
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
                rows={filteredUsers}
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
      </PanelGroup>
    </Box>
  );
}
