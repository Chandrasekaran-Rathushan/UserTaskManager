"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addNewTask,
  deleteTaskDetail,
  updateTaskDetails,
} from "@/store/features/modals/taskModalSlice";
import { useAuth } from "@/app/contexts/AuthContext";
import { TaskPayload, TaskPriorities, TaskStatuses } from "@/app/api/taskApis";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@mui/material";
import UtmDateTimePicker from "../form-elements/date-time-picker";
import ModalPopup from "../modal/modal-popup";
import ConfirmationDialog from "../modal/modal-popup";
import SelectUtm from "../form-elements/select";
import TextFieldUtm from "../form-elements/text-field";
import Loader from "../loader/loader";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  start: yup.date().required("Start date is required"),
  end: yup
    .date()
    .required("End date is required")
    .min(yup.ref("start"), "End date can't be before start date"),
  status: yup
    .mixed<TaskStatuses>()
    .oneOf([
      TaskStatuses.New,
      TaskStatuses.Ongoing,
      TaskStatuses.Completed,
      TaskStatuses.Suspended,
    ])
    .required("Status is required"),
  priority: yup
    .mixed<TaskPriorities>()
    .oneOf([
      TaskPriorities.Low,
      TaskPriorities.Medium,
      TaskPriorities.High,
      TaskPriorities.Critical,
    ])
    .required("Priority is required"),
});

interface EventModalProps {
  open: boolean;
  handleClose: () => void;
}

const mapEnumValue = (value: number, enumObject: any): any | undefined => {
  const keys = Object.keys(enumObject);
  const values = Object.values(enumObject);
  const index = keys.findIndex((key) => key === `${value}`);
  return values[index];
};

const EventModal: React.FC<EventModalProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getUserToken } = useAuth();
  const token = getUserToken() || "";

  const {
    taskId,
    task,
    loading: isTaskLoading,
    error,
  } = useSelector((state: RootState) => state.taskModal);

  const {
    taskPriorities,
    taskStatuses,
    loading: isLookupListsLoading,
  } = useSelector((state: RootState) => state.lookupLists);

  const { openSnackbar } = useSnackbar();

  const initialFormData = {
    title: "",
    description: "",
    start: undefined,
    end: undefined,
    status: undefined,
    priority: undefined,
  };

  const [formData, setFormData] = useState<any>(initialFormData);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskPayload>({
    resolver: yupResolver(taskSchema),
    defaultValues: useMemo(() => {
      return formData;
    }, [formData]),
  });

  useEffect(() => {
    if (task && taskPriorities && taskStatuses) {
      setFormData(task);
      reset({
        title: task.title,
        description: task.description,
        start: task.start ? new Date(task.start) : undefined,
        end: task.end ? new Date(task.end) : undefined,
        priority: mapEnumValue(task.priority, TaskPriorities),
        status: mapEnumValue(task.status, TaskStatuses),
      });
    } else {
      setFormData(initialFormData);
      reset(initialFormData);
    }
  }, [task, taskPriorities, taskStatuses]);

  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const onSreenSizeChangeSx = {
    display: { sm: "none", xs: "none", md: "block" },
  };

  const onSubmit = (formData: TaskPayload) => {
    if (task) {
      dispatch(updateTaskDetails(`${task.id}`, formData, token, openSnackbar));
    } else {
      dispatch(addNewTask(formData, token, openSnackbar));
    }
    handleClose();
  };

  function handleDelete(event: React.MouseEvent<HTMLElement>): void {
    if (taskId && parseInt(taskId) > 0) {
      handleOpenDeleteConfirmation();
    }
  }

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);

  function handleCloseDeleteConfirmation(): void {
    setDeleteConfirmationOpen(false);
  }

  function handleOpenDeleteConfirmation(): void {
    setDeleteConfirmationOpen(true);
  }

  return (
    <Box>
      <ModalPopup
        open={open && !deleteConfirmationOpen}
        onClose={handleClose}
        title={taskId && parseInt(taskId) > 0 ? "Update Task" : "Add New Task"}
        maxWidth="md"
        fullWidth
        submitRef={submitButtonRef}
        deleteRef={deleteButtonRef}
      >
        {!isTaskLoading && !isLookupListsLoading ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ margin: 0, padding: "8px 0" }}
          >
            <Grid container spacing={3}>
              <Grid
                item
                md={12}
                xs={12}
                container
                spacing={3}
                justifyContent="space-between"
              >
                <Grid item md={6} xs={12}>
                  <SelectUtm
                    name="status"
                    control={control}
                    label="Status"
                    options={taskStatuses}
                    error={errors.status}
                    testid="status"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <SelectUtm
                    name="priority"
                    control={control}
                    label="Priority"
                    options={taskPriorities}
                    error={errors.priority}
                    testid="priority"
                  />
                </Grid>
              </Grid>

              <Grid item md={12} container>
                <Grid item md={3} xs={0} sx={onSreenSizeChangeSx}>
                  <label>Title: </label>
                </Grid>
                <Grid item md={9} xs={12}>
                  <TextFieldUtm
                    name="title"
                    control={control}
                    label="Title"
                    error={errors.title}
                    testid="title"
                  />
                </Grid>
              </Grid>

              <Grid item md={12} container>
                <Grid item md={3} xs={0} sx={onSreenSizeChangeSx}>
                  <label>Description: </label>
                </Grid>
                <Grid item md={9} xs={12}>
                  <TextFieldUtm
                    name="description"
                    control={control}
                    label="Description"
                    error={errors.description}
                    testid="description"
                  />
                </Grid>
              </Grid>

              <Grid item md={12} container>
                <Grid item md={3} xs={0} sx={onSreenSizeChangeSx}>
                  <label>Start Date: </label>
                </Grid>
                <Grid item md={9} xs={12}>
                  <UtmDateTimePicker
                    fullWidth={true}
                    name="start"
                    control={control}
                    label="Start Date"
                    error={!!errors.start && !!errors?.start?.message}
                    helperText={errors?.start?.message || ""}
                    testid="startDate"
                  />
                </Grid>
              </Grid>

              <Grid item md={12} container>
                <Grid item md={3} xs={0} sx={onSreenSizeChangeSx}>
                  <label>End Date: </label>
                </Grid>
                <Grid item md={9} xs={12}>
                  <UtmDateTimePicker
                    fullWidth={true}
                    name="end"
                    control={control}
                    label="End Date"
                    error={!!errors.end && !!errors?.end?.message}
                    helperText={errors?.end?.message || ""}
                    testid="endDate"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Button
              sx={{ display: "none", mr: 3 }}
              variant="contained"
              color="error"
              size="medium"
              onClick={handleDelete}
              ref={taskId && parseInt(taskId) > 0 ? deleteButtonRef : null}
            >
              Delete
            </Button>

            <Button
              sx={{ display: "none" }}
              variant="contained"
              color="primary"
              size="medium"
              type="submit"
              ref={submitButtonRef}
              data-testid="submitBtn"
            >
              Save
            </Button>
          </form>
        ) : (
          <Box width="100%" height="15rem">
            <Loader hideText />
          </Box>
        )}
      </ModalPopup>
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        title="Confirmation"
        maxWidth="xs"
        fullWidth
        disableActions
      >
        <Typography variant="h6" sx={{ mb: 5, mt: 2 }}>
          Are you sure want to delete this?
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={handleCloseDeleteConfirmation}
            size="medium"
            color="primary"
            variant="outlined"
            sx={{ mr: 3 }}
          >
            No
          </Button>

          <Button
            onClick={() => {
              dispatch(deleteTaskDetail(`${taskId}`, token, openSnackbar));
              handleCloseDeleteConfirmation();
            }}
            color="error"
            variant="contained"
            size="medium"
          >
            Yes
          </Button>
        </Box>
      </ConfirmationDialog>
    </Box>
  );
};

export default EventModal;
