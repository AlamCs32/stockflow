import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  sidebarOpen: boolean;
  loading: boolean;
}

const initialState: AppState = {
  sidebarOpen: true,
  loading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setLoading } = appSlice.actions;
export default appSlice.reducer;
