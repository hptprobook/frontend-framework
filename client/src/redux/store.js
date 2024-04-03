import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import columnReducer from './slices/columnSlice';
import cardReducer from './slices/cardSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    boards: boardReducer,
    columns: columnReducer,
    cards: cardReducer,
    auth: authReducer,
  },
});

export default store;
