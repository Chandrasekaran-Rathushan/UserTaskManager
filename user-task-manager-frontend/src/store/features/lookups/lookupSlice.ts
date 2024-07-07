import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../store";
import { getTaskPriorities, getTaskStatuses, ListItem } from "@/app/api/lookupApis";

interface TasksState {
  taskStatuses: ListItem[];
  taskPriorities: ListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  taskStatuses: [],
  taskPriorities: [],
  loading: false,
  error: null,
};

const lookupSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTaskStatusesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTaskStatusesSuccess(state, action: PayloadAction<ListItem[]>) {
      state.loading = false;
      state.taskStatuses = action.payload;
    },
    fetchTaskStatusesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTaskPrioritiesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTaskPrioritiesSuccess(state, action: PayloadAction<ListItem[]>) {
      state.loading = false;
      state.taskPriorities = action.payload;
    },
    fetchTaskPrioritiesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTaskStatusesStart,
  fetchTaskStatusesSuccess,
  fetchTaskStatusesFailure,
  fetchTaskPrioritiesStart,
  fetchTaskPrioritiesSuccess,
  fetchTaskPrioritiesFailure,
} = lookupSlice.actions;

export const fetchTaskStatuses =
  (token: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchTaskStatusesStart());
      const response = await getTaskStatuses(token);
      dispatch(fetchTaskStatusesSuccess(response));
    } catch (error: any) {
      dispatch(fetchTaskStatusesFailure(error || "Something went wrong"));
    }
  };

export const fetchTaskPriorities =
  (token: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchTaskPrioritiesStart());
      const response = await getTaskPriorities(token);
      dispatch(fetchTaskPrioritiesSuccess(response));
    } catch (error: any) {
      dispatch(fetchTaskPrioritiesFailure(error || "Something went wrong"));
    }
  };

export default lookupSlice.reducer;
