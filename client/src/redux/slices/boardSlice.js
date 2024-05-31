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

export const getBoardDetails = createAsyncThunk(
  'board/getDetails',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await boardServices.getBoardDetailAPI(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOtherBoards = createAsyncThunk(
  'board/getOther',
  async (_, { rejectWithValue }) => {
    try {
      return await boardServices.getOtherBoard();
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
    otherBoards: [],
    boardDetail: null,
    newBoard: null,
    updatedBoard: null,
    isDeleted: false,
    isLoading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.newBoard = action.payload;
      })
      .addCase(createNewBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAllBoards.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(getAllBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.boards = action.payload;
      })
      .addCase(getAllBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getBoardDetails.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(getBoardDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.boardDetail = action.payload;
      })
      .addCase(getBoardDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOtherBoards.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(getOtherBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.otherBoards = action.payload;
      })
      .addCase(getOtherBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBoardDetails.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(updateBoardDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.updatedBoard = action.payload;
      })
      .addCase(updateBoardDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.response.data.message;
      })
      .addCase(deleteBoardDetails.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(deleteBoardDetails.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
        state.isDeleted = true;
      })
      .addCase(deleteBoardDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default boardSlices.reducer;
