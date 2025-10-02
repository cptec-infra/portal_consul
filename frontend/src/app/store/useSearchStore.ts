import { create } from 'zustand';

interface SearchState {
  value: string;
  setSearch: (newValue: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  value: '',

  setSearch: (newValue) => set({ value: newValue }),
  
  clearSearch: () => set({ value: '' }),
}));

export type SearchStoreState = ReturnType<typeof useSearchStore.getState>;