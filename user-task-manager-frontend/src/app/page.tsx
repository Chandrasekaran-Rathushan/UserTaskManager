"use client";

import Calendar from "@/app/components/calendar/calendar";
import PrivateRoute from "@/app/hocs/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchTasks, setFilters } from "@/store/features/tasks/tasksSlice";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  fetchTaskPriorities,
  fetchTaskStatuses,
} from "@/store/features/lookups/lookupSlice";
import UtmAppBar from "@/app/components/app-bar/app-bar";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Popover,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useModal from "@/app/hooks/useModal";
import EventModal from "@/app/components/calendar/calendar-event-modal";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "@/app/components/loader/loader";
import MultiSelectUti from "./components/form-elements/multi-select";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";

export interface IFilter {
  priority: string[];
  status: string[];
  title: string | null;
}

export default function App() {
  const { getUserToken } = useAuth() || {};
  const token = getUserToken() || "";

  const dispatch = useDispatch<AppDispatch>();
  const { filters, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  const { openSnackbar } = useSnackbar() || {};

  const { taskPriorities, taskStatuses } = useSelector(
    (state: RootState) => state.lookupLists
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchTasks(token));
      dispatch(fetchTaskStatuses(token));
      dispatch(fetchTaskPriorities(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (error) {
      openSnackbar(error, "error");
    }
  }, [error]);

  const { open, handleOpen, handleClose } = useModal();

  const initialFilterData: IFilter = {
    status: ["New", "Ongoing", "Completed", "Suspended"],
    priority: ["Low", "Medium", "High", "Critical"],
    title: null,
  };

  const [filtersdata, setFiltersData] = useState<IFilter>(initialFilterData);

  useEffect(() => {
    if (filters) {
      setFiltersData(filters);
    }
  }, [filters]);

  const handleMultiSelectFiltersOnChange = (
    event: SelectChangeEvent<
      | typeof filtersdata.priority
      | typeof filtersdata.status
      | typeof filtersdata.title
    >
  ) => {
    const {
      target: { name, value },
    } = event;

    setFiltersData((filtersdata) => ({
      ...filtersdata,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleTextFieldFiltersOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;

    setFiltersData((filtersdata) => ({
      ...filtersdata,
      [name]: value,
    }));
  };

  let typingTimer: NodeJS.Timeout | undefined;
  var doneTypingInterval = 850;

  const handleTextFieldKeyUp = (event: React.KeyboardEvent) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  };

  const handleTextFieldKeyDown = (event: React.KeyboardEvent) => {
    clearTimeout(typingTimer);
  };

  function doneTyping() {
    search();
  }

  const handleMuiSelectClose = (event: React.SyntheticEvent<Element, Event>) => {
    search();
  };

  function search(filters?: IFilter) {
    dispatch(setFilters(filters ? filters : filtersdata));
    dispatch(fetchTasks(token));
  }

  const handleClearSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newFilters = { ...filtersdata, title: null };
    setFiltersData(newFilters);

    search(newFilters);
  };

  function handleResetFilters(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    setFiltersData(initialFilterData);
    search(initialFilterData);
    handleCloseFilterPopover();
  }

  const areFiltersEqual = (filter1: IFilter, filter2: IFilter): boolean => {
    return JSON.stringify(filter1) === JSON.stringify(filter2);
  };

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const [anchorElFilterPopover, setAnchorElFilterPopover] =
    useState<HTMLButtonElement | null>(null);

  const handleOpenFilterPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElFilterPopover(event.currentTarget);
  };

  const handleCloseFilterPopover = () => {
    setAnchorElFilterPopover(null);
  };

  const openFilterPopover = Boolean(anchorElFilterPopover);
  const popoverId = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (isMd) {
      handleCloseFilterPopover();
    }
  }, [isMd]);

  return (
    <PrivateRoute>
      <div>
        <UtmAppBar />
        <Box sx={{ px: 2, pt: 2 }}>
          <Box display="flex" width="100%" alignItems="center">
            <Box flexGrow={3}>
              {isMd ? (
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <MultiSelectUti
                      name="status"
                      value={filtersdata.status}
                      label="Status"
                      fullWidth={true}
                      options={taskStatuses}
                      handleChange={handleMultiSelectFiltersOnChange}
                      handleMenuClose={handleMuiSelectClose}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <MultiSelectUti
                      name="priority"
                      value={filtersdata.priority}
                      label="Priority"
                      fullWidth={true}
                      options={taskPriorities}
                      handleChange={handleMultiSelectFiltersOnChange}
                      handleMenuClose={handleMuiSelectClose}
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    container
                    display="flex"
                    justifyContent="center"
                  >
                    <TextField
                      size="small"
                      name="title"
                      label="Search by Title"
                      variant="outlined"
                      sx={{
                        width: { md: "60%", xs: "100%" },
                        placeSelf: "center",
                        alignSelf: "center",
                      }}
                      onChange={handleTextFieldFiltersOnChange}
                      onKeyUp={handleTextFieldKeyUp}
                      onKeyDown={handleTextFieldKeyDown}
                      value={filtersdata.title || ""}
                      InputProps={{
                        endAdornment: filtersdata.title ? (
                          <InputAdornment position="start" sx={{ mr: 0 }}>
                            <IconButton
                              size="small"
                              onClick={handleClearSearch}
                            >
                              <ClearIcon fontSize="inherit" />
                            </IconButton>
                          </InputAdornment>
                        ) : (
                          <></>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Button
                    id={popoverId}
                    variant="text"
                    startIcon={<TuneIcon />}
                    onClick={handleOpenFilterPopover}
                    size="large"
                    sx={{
                      height: "2.5rem",
                      mr: 4,
                      textDecoration: "underline",
                    }}
                    color="info"
                  >
                    Filters
                  </Button>
                  <Popover
                    id={popoverId}
                    open={openFilterPopover}
                    anchorEl={anchorElFilterPopover}
                    onClose={handleCloseFilterPopover}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Box p={3}>
                      <Box display="flex" justifyContent="space-between" mb={3}>
                        <Typography variant="body1" color="primary">
                          Filters
                        </Typography>
                        <IconButton onClick={handleCloseFilterPopover}>
                          <CloseIcon color="primary" />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item md={3} xs={12}>
                          <MultiSelectUti
                            name="status"
                            value={filtersdata.status}
                            label="Status"
                            fullWidth={true}
                            options={taskStatuses}
                            handleChange={handleMultiSelectFiltersOnChange}
                            handleMenuClose={handleMuiSelectClose}
                          />
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <MultiSelectUti
                            name="priority"
                            value={filtersdata.priority}
                            label="Priority"
                            fullWidth={true}
                            options={taskPriorities}
                            handleChange={handleMultiSelectFiltersOnChange}
                            handleMenuClose={handleMuiSelectClose}
                          />
                        </Grid>
                        <Grid
                          item
                          md={6}
                          xs={12}
                          container
                          display="flex"
                          justifyContent="center"
                        >
                          <TextField
                            size="small"
                            name="title"
                            label="Search by Title"
                            variant="outlined"
                            sx={{
                              width: { md: "60%", xs: "100%" },
                              placeSelf: "center",
                              alignSelf: "center",
                            }}
                            onChange={handleTextFieldFiltersOnChange}
                            onKeyUp={handleTextFieldKeyUp}
                            onKeyDown={handleTextFieldKeyDown}
                            value={filtersdata.title || ""}
                            InputProps={{
                              endAdornment: filtersdata.title ? (
                                <InputAdornment position="start" sx={{ mr: 0 }}>
                                  <IconButton
                                    size="small"
                                    onClick={handleClearSearch}
                                  >
                                    <ClearIcon fontSize="inherit" />
                                  </IconButton>
                                </InputAdornment>
                              ) : (
                                <></>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Button
                        variant="outlined"
                        onClick={handleCloseFilterPopover}
                        size="large"
                        color="primary"
                        sx={{ height: "2.5rem", float: "right", my: 3 }}
                      >
                        Close
                      </Button>
                      {!areFiltersEqual(initialFilterData, filtersdata) ? (
                        <Button
                          variant="outlined"
                          startIcon={<CloseIcon />}
                          onClick={handleResetFilters}
                          size="large"
                          color="error"
                          sx={{
                            height: "2.5rem",
                            float: "right",
                            my: 3,
                            mr: 2,
                          }}
                        >
                          Clear Filters
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Box>
                  </Popover>
                </>
              )}
            </Box>
            <Box flexGrow={1}>
              <Box
                display="flex"
                width="100%"
                justifyContent="flex-end"
                alignItems="center"
              >
                {!areFiltersEqual(initialFilterData, filtersdata) ? (
                  <Button
                    variant="outlined"
                    startIcon={isMd ? <RestartAltIcon /> : <CloseIcon />}
                    onClick={handleResetFilters}
                    size="large"
                    color="error"
                    sx={{ height: "2.5rem", mr: 4 }}
                  >
                    Filters
                  </Button>
                ) : (
                  <></>
                )}

                <Button
                  variant="outlined"
                  startIcon={<AddCircleIcon />}
                  onClick={handleOpen}
                  size="large"
                  sx={{ height: "2.5rem", mr: 4 }}
                  color="info"
                >
                  Task
                </Button>

                <Tooltip title="Refresh">
                  <IconButton
                    aria-label="refresh"
                    size="large"
                    onClick={() => dispatch(fetchTasks(token))}
                  >
                    <CachedIcon fontSize="inherit" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          <Box sx={{ py: 2, mt: 1 }}>
            {loading ? <Loader hideText /> : <Calendar />}
          </Box>
        </Box>
        <EventModal open={open} handleClose={handleClose} />
      </div>
    </PrivateRoute>
  );
}
