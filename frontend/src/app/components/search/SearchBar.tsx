import { useSearchStore } from '@/app/store/useSearchStore';
import { TextField } from '@mui/material';

export function SearchBar() {
  const { value, setSearch, clearSearch } = useSearchStore();

  return (
    <TextField
      label="Buscar serviço"
      variant="outlined"
      size="small"
      value={value}
      onChange={(e) => setSearch(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}
