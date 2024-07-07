import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Control, Controller, FieldError } from "react-hook-form";
import { ListItem } from "@/app/api/lookupApis";

interface SelectUtmProps {
  name: string;
  control: Control<any>;
  label: string;
  options: ListItem[];
  error?: FieldError;
}

const SelectUtm: React.FC<SelectUtmProps> = ({
  name,
  control,
  label,
  options,
  error,
}) => {
  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel size="small" id={`lbl-${name}`}>
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Select
              size="small"
              variant="outlined"
              labelId={`lbl-${name}`}
              label={label}
              {...field}
              value={field.value ? `${field.value}` : ""}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.key}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </>
        )}
      />
    </FormControl>
  );
};

export default SelectUtm;
