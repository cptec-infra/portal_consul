'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { fetchGroups } from '@/app/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/store/store';
import { Group } from './types';
import GroupDetails from './GroupDetails';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const searchTerm = useSelector((state: RootState) => state.search.value);

  useEffect(() => {
    const getGroups = async () => {
      try {
        const data = await fetchGroups();

        const list = Array.isArray(data?.grupos) ? data.grupos : [];
        const normalized: Group[] = list.map((u: any, index) => ({
          cn: String(u.cn || `group-${index}`), 
          description: String(u.description || '-'),
          gidNumber: String(u.gidnumber || '-'),
          memberUser: Array.isArray(u.member_user) ? u.member_user.map(String) : [],
        }));

        setGroups(normalized); 
      } catch (error) {
        console.error('Erro ao buscar grupos:', error);
      } finally {
        setLoading(false);
      }
    };

    getGroups();
  }, []);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    return groups.filter((group) =>
      Object.values(group)
        .filter((v) => typeof v === 'string')
        .some((value) =>
          (value as string).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [groups, searchTerm]);

  const columns: GridColDef[] = [
    { field: 'gidNumber', headerName: 'GID', flex: 0 },
    { field: 'cn', headerName: 'Nome do Grupo', flex: 1 },
    { field: 'description', headerName: 'Descrição', flex: 2 },
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
                rows={filteredGroups}
                columns={columns}
                getRowId={(row) => row.cn || `group-${Math.random()}`}
                onRowClick={(params) => setSelectedGroup(params.row)}
                hideFooter
                sx={{
                  border: 'none',
                  height: '100%',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(223, 224, 224, 0.2)',
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
          {selectedGroup ? (
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
              <GroupDetails
                group={selectedGroup || ''}
                onClose={() => setSelectedGroup(null)}
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
                Selecione o grupo para ver os detalhes.
              </Typography>
            </Paper>
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
}