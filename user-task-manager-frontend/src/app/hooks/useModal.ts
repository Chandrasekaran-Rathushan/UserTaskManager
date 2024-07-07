"use client";

import { closeModal } from "@/store/features/modals/taskModalSlice";
import store from "@/store/store";
import { useState, useCallback } from "react";

const useModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    store.dispatch(closeModal());
  }, []);

  return {
    open,
    handleOpen,
    handleClose,
  };
};

export default useModal;
