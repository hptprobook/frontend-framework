import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authServices from '~/services/authService';

export const loginGoogle = createAsyncThunk(
  'auth/google',
  async ({ data }, { rejectWithValue }) => {
    try {
      return await authServices.loginGoogle(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginWithPhoneNumber = createAsyncThunk(
  'auth/phoneNumber',
  async ({ data }, { rejectWithValue }) => {
    try {
      return await authServices.loginWithPhoneNumber(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    isLoading: true,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginGoogle.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isLoggedIn = false;
      })
      .addCase(loginGoogle.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isLoggedIn = true;
      })
      .addCase(loginGoogle.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
      });
  },
});

export default authSlice.reducer;
