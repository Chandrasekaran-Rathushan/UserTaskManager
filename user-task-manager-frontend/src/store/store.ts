import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import tasksReducer from "./features/tasks/tasksSlice";
import lookupReducer from "./features/lookups/lookupSlice";
import taskModalReducer from "./features/modals/taskModalSlice";

const appReducer = combineReducers({
  tasks: tasksReducer,
  lookupLists: lookupReducer,
  taskModal: taskModalReducer,
});

const RESET_STATE = "RESET_STATE";

export const resetState = () => ({
  type: RESET_STATE,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
