import { FC, ReactNode, RefObject, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

interface ModalPopupProps {
  title: string;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  submitRef?: RefObject<HTMLButtonElement>;
  open: boolean;
  onClose: () => void;
  fullWidth?: boolean;
  deleteRef?: RefObject<HTMLButtonElement>;
  disableActions?: boolean;
}

const ModalPopup: FC<ModalPopupProps> = ({
  title,
  children,
  maxWidth = "sm",
  submitRef,
  open,
  onClose,
  fullWidth = false,
  deleteRef,
  disableActions = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle color="primary">
        {title}
        <IconButton onClick={onClose} style={{ float: "right" }}>
          <CloseIcon color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {!disableActions ? (
        <DialogActions>
          <Box width="100%" display="flex">
            <Box flex={1}>
              {deleteRef?.current ? (
                <Tooltip title="Delete Task">
                  <Button
                    aria-label="delete"
                    size="large"
                    color="error"
                    onClick={() => {
                      if (deleteRef?.current) {
                        deleteRef.current.click();
                      }
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Tooltip>
              ) : (
                <></>
              )}
            </Box>
            <Box flex={1}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={onClose}
                  size="medium"
                  color="error"
                  variant="contained"
                  sx={{ mr: 3 }}
                >
                  Close
                </Button>
                {submitRef ? (
                  <Button
                    onClick={() => {
                      if (submitRef?.current) {
                        submitRef.current.click();
                      }
                    }}
                    color="primary"
                    variant="contained"
                    size="medium"
                  >
                    Save
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </Box>
        </DialogActions>
      ) : (
        <></>
      )}
    </Dialog>
  );
};

export default ModalPopup;
