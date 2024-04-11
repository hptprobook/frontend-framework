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

export const findUser = createAsyncThunk(
  'user/find',
  async (data, { rejectWithValue }) => {
    try {
      return await userService.findUser(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const readNotify = createAsyncThunk(
  'user/readNotify',
  async (data, { rejectWithValue }) => {
    try {
      return await userService.readNotify(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    current: null,
    findResults: {},
    isReaded: false,
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
      })
      .addCase(findUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.findResults = action.payload;
      })
      .addCase(findUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(readNotify.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(readNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isReaded = action.payload;
      })
      .addCase(readNotify.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userSlice.reducer;
