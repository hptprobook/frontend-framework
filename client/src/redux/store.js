import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './slices/workspaceSlice';
import boardReducer from './slices/boardSlice';
import columnReducer from './slices/columnSlice';
import cardReducer from './slices/cardSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    workspaces: workspaceReducer,
    boards: boardReducer,
    columns: columnReducer,
    cards: cardReducer,
    auth: authReducer,
    users: userReducer,
  },
});

export default store;
