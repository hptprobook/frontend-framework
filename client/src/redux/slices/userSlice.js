import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '~/services/userService';

export const getCurrent = createAsyncThunk(
  'user/current',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getCurrent();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    current: null,
    isLoading: true,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCurrent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.current = action.payload;
      })
      .addCase(getCurrent.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userSlice.reducer;
