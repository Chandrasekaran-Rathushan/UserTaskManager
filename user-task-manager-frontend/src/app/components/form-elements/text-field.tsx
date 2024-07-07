import React from "react";
import { TextField } from "@mui/material";
import { Control, Controller, FieldError } from "react-hook-form";

interface CommonTextFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  fullWidth?: boolean;
  id?: string;
}

const TextFieldUtm: React.FC<CommonTextFieldProps> = ({
  name,
  control,
  label,
  error,
  size = "small",
  variant = "outlined",
  fullWidth = true,
  id,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth={fullWidth}
          label={label}
          id={id || name}
          size={size}
          variant={variant}
          error={!!error}
          helperText={error?.message || ""}
        />
      )}
    />
  );
};

export default TextFieldUtm;
