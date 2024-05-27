import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workspaceService from '~/services/workspaceService';

export const createNewWorkspace = createAsyncThunk(
  'workspaces/createNewWorkspace',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.createNewWorkspaceAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllWorkspace = createAsyncThunk(
  'workspaces/getAllWorkspace',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getAllWorkspaceAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDetailWorkspace = createAsyncThunk(
  'workspaces/getDetailWorkspace',
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getDetailWorkspaceAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateWorkspace = createAsyncThunk(
  'workspaces/updateWorkspace',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.updateWorkspaceAPI(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const inviteMember = createAsyncThunk(
  'workspaces/inviteMember',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.inviteMemberToWorkspaceAPI(
        id,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  'workspaces/deleteWorkspace',
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceService.deleteWorkspaceAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  workspaces: [],
  workspace: null,
  newWorkspace: null,
  invitedMember: null,
  updatedWorkspace: null,
  isDeleted: false,
  isLoading: false,
  error: null,
  loadingStatus: {
    create: false,
    getAll: false,
    getDetail: false,
    update: false,
    invite: false,
    delete: false,
  },
  errorStatus: {
    create: null,
    getAll: null,
    getDetail: null,
    update: null,
    invite: null,
    delete: null,
  },
};

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewWorkspace.pending, (state) => {
        state.loadingStatus.create = true;
        state.errorStatus.create = null;
      })
      .addCase(createNewWorkspace.fulfilled, (state, action) => {
        state.loadingStatus.create = false;
        state.newWorkspace = action.payload;
      })
      .addCase(createNewWorkspace.rejected, (state, action) => {
        state.loadingStatus.create = false;
        state.errorStatus.create = action.payload;
      })
      .addCase(getAllWorkspace.pending, (state) => {
        state.loadingStatus.getAll = true;
        state.errorStatus.getAll = null;
      })
      .addCase(getAllWorkspace.fulfilled, (state, action) => {
        state.loadingStatus.getAll = false;
        state.workspaces = action.payload;
      })
      .addCase(getAllWorkspace.rejected, (state, action) => {
        state.loadingStatus.getAll = false;
        state.errorStatus.getAll = action.payload;
      })
      .addCase(getDetailWorkspace.pending, (state) => {
        state.loadingStatus.getDetail = true;
        state.errorStatus.getDetail = null;
      })
      .addCase(getDetailWorkspace.fulfilled, (state, action) => {
        state.loadingStatus.getDetail = false;
        state.workspace = action.payload;
      })
      .addCase(getDetailWorkspace.rejected, (state, action) => {
        state.loadingStatus.getDetail = false;
        state.errorStatus.getDetail = action.payload;
      })
      .addCase(updateWorkspace.pending, (state) => {
        state.loadingStatus.update = true;
        state.errorStatus.update = null;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.loadingStatus.update = false;
        state.updatedWorkspace = action.payload;
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.loadingStatus.update = false;
        state.errorStatus.update = action.payload;
      })
      .addCase(inviteMember.pending, (state) => {
        state.loadingStatus.invite = true;
        state.errorStatus.invite = null;
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        state.loadingStatus.invite = false;
        state.invitedMember = action.payload;
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.loadingStatus.invite = false;
        state.errorStatus.invite = action.payload;
      })
      .addCase(deleteWorkspace.pending, (state) => {
        state.loadingStatus.delete = true;
        state.errorStatus.delete = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state) => {
        state.loadingStatus.delete = false;
        state.isDeleted = true;
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.loadingStatus.delete = false;
        state.errorStatus.delete = action.payload;
      });
  },
});

export default workspaceSlice.reducer;
