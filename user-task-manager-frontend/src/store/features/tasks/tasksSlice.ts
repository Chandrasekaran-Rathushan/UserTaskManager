import { IFilter } from "./../../../app/page";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store";
import { getTasks, Task } from "@/app/api/taskApis";

interface TasksState {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;
  filters: IFilter;
}

const initialFilters: IFilter = {
  status: ["New", "Ongoing", "Completed", "Suspended"],
  priority: ["Low", "Medium", "High", "Critical"],
  title: null,
};

const initialState: TasksState = {
  tasks: [],
  filters: initialFilters,
  task: null,
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<IFilter>) {
      state.filters = action.payload;
    },
    resetFilters(state) {
      state.filters = initialFilters;
    },
    fetchTasksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
} = tasksSlice.actions;

export const fetchTasks =
  (token: string): AppThunk =>
  async (dispatch, getState: () => RootState) => {
    try {
      dispatch(fetchTasksStart());
      const currentState = getState();
      var filters = currentState.tasks.filters;

      var params = {};
      if (filters.priority.length > 0) {
        params = { ...params, ["priority"]: filters.priority.join(",") };
      }
      if (filters.status.length > 0) {
        params = { ...params, ["status"]: filters.status.join(",") };
      }
      if (filters.title && filters.title !== "") {
        params = { ...params, ["title"]: filters.title };
      }

      const response = await getTasks(params, token);
      dispatch(fetchTasksSuccess(response));
    } catch (ex: any) {
      var errorText = ex.message || "Failed to load tasks.";
      dispatch(fetchTasksFailure(errorText));
    }
  };

export default tasksSlice.reducer;
