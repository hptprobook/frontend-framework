import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cardServices from '~/services/cardService';

export const createNewCard = createAsyncThunk(
  'card/create',
  async ({ data }, { rejectWithValue }) => {
    try {
      return await cardServices.createNewCardAPI(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCardDetails = createAsyncThunk(
  'card/updateDetails',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await cardServices.updateCardDetailsAPI(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCardDetails = createAsyncThunk(
  'card/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await cardServices.deleteCardAPI(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const cardSlices = createSlice({
  name: 'cards',
  initialState: {
    cards: null,
    newCard: null,
    updatedCard: null,
    isDeleted: false,
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewCard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createNewCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.newCard = action.payload;
      })
      .addCase(createNewCard.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateCardDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateCardDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.updatedCard = action.payload;
      })
      .addCase(updateCardDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteCardDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteCardDetails.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isDeleted = true;
      })
      .addCase(deleteCardDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default cardSlices.reducer;
