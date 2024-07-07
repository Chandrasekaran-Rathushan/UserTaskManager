"use client";

import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import styles from "./loader.module.css";
import { useTheme } from "@mui/material";

interface LoaderProps {
  text?: string | undefined | null;
  hideText?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ text, hideText = false }) => {
  const theme = useTheme();
  const zIndexDrawer = theme.zIndex.drawer;

  return (
    <Backdrop
      sx={{
        color: "#092532",
        zIndex: zIndexDrawer + 100,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }}
      open={true}
    >
      <div className={styles.loaderDiv}>
        <CircularProgress color="inherit" />
        {!hideText ? (
          <p className={styles.loaderText}>{text ? text : "Loading ..."}</p>
        ) : (
          <></>
        )}
      </div>
    </Backdrop>
  );
};

export default Loader;
