import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import columnServices from '~/services/columnService';

export const createNewColumn = createAsyncThunk('column/create', async ({ data }, { rejectWithValue }) => {
  try {
    return await columnServices.createNewColumnAPI(data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateColumnDetails = createAsyncThunk('column/updateDetails', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await columnServices.updateColumnDetailsAPI(id, data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteColumnDetails = createAsyncThunk('column/delete', async ({ id }, { rejectWithValue }) => {
  try {
    return await columnServices.deleteColumnDetailsAPI(id);
  } catch (error) {
    return rejectWithValue(error);
  }
});

const columnSlices = createSlice({
  name: 'columns',
  initialState: {
    columns: null,
    newColumn: null,
    updatedColumn: null,
    isDeleted: false,
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewColumn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createNewColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.newColumn = action.payload;
      })
      .addCase(createNewColumn.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateColumnDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateColumnDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.updatedColumn = action.payload;
      })
      .addCase(updateColumnDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteColumnDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteColumnDetails.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isDeleted = true;
      })
      .addCase(deleteColumnDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default columnSlices.reducer;
