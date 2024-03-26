import { configureStore } from '@reduxjs/toolkit';
import columnReducer from './slices/columnSlice';

const store = configureStore({
  reducer: {
    columns: columnReducer,
  },
});

export default store;
