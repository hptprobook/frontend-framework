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

export const getDetails = createAsyncThunk(
  'card/getDetails',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await cardServices.getDetails(id);
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

export const addTodo = createAsyncThunk(
  'card/addTodo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await cardServices.addTodo(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addTodoChild = createAsyncThunk(
  'card/addTodoChild',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await cardServices.addTodoChild(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addComment = createAsyncThunk(
  'card/addComment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await cardServices.addComment(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCommentReaction = createAsyncThunk(
  'card/updateCommentReaction',
  async ({ id, commentId, data }, { rejectWithValue }) => {
    try {
      return await cardServices.updateCommentReaction(id, commentId, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateReplyCommentReaction = createAsyncThunk(
  'card/updateCommentReaction',
  async ({ id, commentId, replyId, data }, { rejectWithValue }) => {
    try {
      return await cardServices.updateReplyCommentReaction(
        id,
        commentId,
        replyId,
        data
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeCommentReaction = createAsyncThunk(
  'card/removeCommentReaction',
  async ({ id, commentId }, { rejectWithValue }) => {
    try {
      return await cardServices.removeCommentReaction(id, commentId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeReplyCommentReaction = createAsyncThunk(
  'card/removeCommentReaction',
  async ({ id, commentId, replyId }, { rejectWithValue }) => {
    try {
      return await cardServices.removeReplyCommentReaction(
        id,
        commentId,
        replyId
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const replyComment = createAsyncThunk(
  'card/replyComment',
  async ({ id, commentId, data }, { rejectWithValue }) => {
    try {
      return await cardServices.replyComment(id, commentId, data);
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

export const deleteTodo = createAsyncThunk(
  'card/deleteTodo',
  async ({ id, todoId }, { rejectWithValue }) => {
    try {
      return await cardServices.deleteTodoAPI(id, todoId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTodoChild = createAsyncThunk(
  'card/deleteTodoChild',
  async ({ id, todoId, childId }, { rejectWithValue }) => {
    try {
      return await cardServices.deleteTodoChildAPI(id, todoId, childId);
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
    newComment: null,
    todoAdded: false,
    todoChildAdded: null,
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
      .addCase(getDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.cards = action.payload;
      })
      .addCase(getDetails.rejected, (state) => {
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
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.todoAdded = action.payload;
      })
      .addCase(addTodo.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(addTodoChild.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.todoChildAdded = action.payload;
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
