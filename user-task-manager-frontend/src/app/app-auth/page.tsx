"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import AuthForm from "./auth-form";

export default function AppAuth() {
  const { login, registerUser } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFormSubmit = (data: any) => {
    setDisableSubmit(true);
    const { email, password } = data || {};
    try {
      if (tabValue === 0) {
        login(email, password);
      }

      if (tabValue === 1) {
        const successCallback = () => {
          setTabValue(0);
        };
        registerUser(email, password, successCallback);
      }
    } catch (error) {}

    setDisableSubmit(false);
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #4287f5 10%, #fefefe 60%)",
      }}
    >
      <Box
        sx={{
          width: { md: "28%", xs: "80%" },
          display: "block",
          borderRadius: "16px",
          bgcolor: "background.paper",
          boxShadow: 6,
          p: 3,
        }}
      >
        <Typography variant="h6" align="center" mb={5}>
          Welcome to Task Tracker.
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Sign In" sx={{ width: "50%" }} />
          <Tab label="Sign Up" sx={{ width: "50%" }} />
        </Tabs>
        <Box sx={{ p: 3, width: "100%" }}>
          {tabValue === 0 && (
            <AuthForm
              isSignIn
              onSubmit={handleFormSubmit}
              disableSubmit={disableSubmit}
            />
          )}
          {tabValue === 1 && (
            <AuthForm
              isSignIn={false}
              onSubmit={handleFormSubmit}
              disableSubmit={disableSubmit}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
