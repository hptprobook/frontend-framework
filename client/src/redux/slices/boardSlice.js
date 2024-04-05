import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import boardServices from '~/services/boardService';

export const createNewBoard = createAsyncThunk(
  'board/create',
  async ({ data }, { rejectWithValue }) => {
    try {
      return await boardServices.createNewBoardAPI(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllBoards = createAsyncThunk(
  'board/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await boardServices.getAllBoardsAPI();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateBoardDetails = createAsyncThunk(
  'board/updateDetails',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await boardServices.updateBoardDetailsAPI(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteBoardDetails = createAsyncThunk(
  'board/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await boardServices.deleteBoardAPI(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const boardSlices = createSlice({
  name: 'boards',
  initialState: {
    boards: null,
    newBoard: null,
    updatedBoard: null,
    isDeleted: false,
    isLoading: true,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewBoard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createNewBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.newBoard = action.payload;
      })
      .addCase(createNewBoard.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getAllBoards.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.boards = action.payload;
      })
      .addCase(getAllBoards.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateBoardDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateBoardDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.updatedBoard = action.payload;
      })
      .addCase(updateBoardDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteBoardDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteBoardDetails.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isDeleted = true;
      })
      .addCase(deleteBoardDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default boardSlices.reducer;
