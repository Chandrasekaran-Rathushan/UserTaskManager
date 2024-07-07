import {
  getTaskById,
  updateTask,
  Task,
  TaskPayload,
  createTask,
  deleteTask,
} from "@/app/api/taskApis";
import { AppThunk } from "../../store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks } from "../tasks/tasksSlice";
import { Severity } from "@/app/contexts/SnackbarContext";
import moment from "moment";

interface ModalState {
  isOpen: boolean;
  taskId: string | null;
  task: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: ModalState = {
  isOpen: false,
  taskId: null,
  task: null,
  loading: false,
  error: null,
};

const taskModalSlice = createSlice({
  name: "taskModal",
  initialState,
  reducers: {
    openModal(state) {
      state.isOpen = true;
    },
    closeModal(state) {
      state.isOpen = false;
      state.taskId = null;
      state.task = null;
    },
    setTaskId(state, action: PayloadAction<string>) {
      state.taskId = action.payload;
    },
    fetchTaskByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTaskByIdSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      state.task = action.payload;
    },
    fetchTaskByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    CreateTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    CreateTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      state.task = action.payload;
    },
    CreateTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    UpdateTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    UpdateTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      state.task = action.payload;
    },
    UpdateTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    DeleteTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    DeleteTaskSuccess(state) {
      state.loading = false;
      state.taskId = null;
      state.task = null;
    },
    DeleteTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  setTaskId,
  fetchTaskByIdStart,
  fetchTaskByIdSuccess,
  fetchTaskByIdFailure,
  CreateTaskStart,
  CreateTaskSuccess,
  CreateTaskFailure,
  UpdateTaskStart,
  UpdateTaskSuccess,
  UpdateTaskFailure,
  DeleteTaskStart,
  DeleteTaskSuccess,
  DeleteTaskFailure,
} = taskModalSlice.actions;

export const fetchTaskById =
  (id: string, token: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchTaskByIdStart());
      const response = await getTaskById(id, token);
      dispatch(fetchTaskByIdSuccess(response));
    } catch (error: any) {
      dispatch(fetchTaskByIdFailure(error || "Something went wrong"));
    }
  };

function formatDateToISOString(dateObj: Date): string {
  const date = moment(dateObj);

  if (!date.isValid()) {
    throw new Error("Invalid date string");
  }

  const formattedDate = date.format("YYYY-MM-DDTHH:mm:ss");
  return formattedDate;
}

export const addNewTask =
  (
    task: TaskPayload,
    token: string,
    openSnackbar: (message: string, severity: Severity) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(CreateTaskStart());

      var payload = JSON.parse(JSON.stringify(task));

      if (payload.start && payload.end) {
        payload = {
          ...task,
          start: formatDateToISOString(payload.start),
          end: formatDateToISOString(payload.end),
        };
      }
      const response = await createTask(payload, token);
      dispatch(CreateTaskSuccess(response));
      openSnackbar("Added task.", "success");
      dispatch(fetchTasks(token));
    } catch (error: any) {
      openSnackbar("Failed to add task.", "error");
      dispatch(CreateTaskFailure(error || "Something went wrong"));
    }
  };

export const updateTaskDetails =
  (
    id: string,
    task: Partial<Task>,
    token: string,
    openSnackbar: (message: string, severity: Severity) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(UpdateTaskStart());

      var payload = JSON.parse(JSON.stringify(task));

      if (payload.start && payload.end) {
        payload = {
          ...task,
          start: formatDateToISOString(payload.start),
          end: formatDateToISOString(payload.end),
        };
      }

      const response = await updateTask(id, payload, token);
      dispatch(UpdateTaskSuccess(response));
      openSnackbar("Updated task.", "success");
      dispatch(fetchTasks(token));
    } catch (error: any) {
      openSnackbar("Failed to update task.", "error");
      dispatch(UpdateTaskFailure(error || "Something went wrong"));
    }
  };

export const deleteTaskDetail =
  (
    id: string,
    token: string,
    openSnackbar: (message: string, severity: Severity) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(DeleteTaskStart());
      const response = await deleteTask(id, token);
      if (response) {
        dispatch(DeleteTaskSuccess());
        openSnackbar("Deleted task.", "success");
        dispatch(fetchTasks(token));
      } else {
        openSnackbar("Failed to delete task.", "error");
        dispatch(DeleteTaskFailure("Failed to delete."));
      }
    } catch (error: any) {
      openSnackbar("Failed to delete task.", "error");
      dispatch(DeleteTaskFailure(error || "Something went wrong"));
    }
  };

export default taskModalSlice.reducer;
