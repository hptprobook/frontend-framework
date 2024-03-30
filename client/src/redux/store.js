import { configureStore } from '@reduxjs/toolkit';
import columnReducer from './slices/columnSlice';
import cardReducer from './slices/cardSlice';

const store = configureStore({
  reducer: {
    columns: columnReducer,
    cards: cardReducer,
  },
});

export default store;
