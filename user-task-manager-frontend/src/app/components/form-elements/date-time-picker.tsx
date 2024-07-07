import * as React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Controller, Control } from "react-hook-form";
import { TextFieldProps } from "@mui/material/TextField";
import moment from "moment";

interface UtmDateTimePickerProps {
  name: string;
  control: Control<any>;
  label: string;
  variant?: TextFieldProps["variant"];
  size?: TextFieldProps["size"];
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
}

const UtmDateTimePicker: React.FC<UtmDateTimePickerProps> = ({
  name,
  control,
  label,
  variant = "outlined",
  size = "small",
  fullWidth = false,
  error = false,
  helperText,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label={label}
            value={field.value ? moment(field.value) : undefined}
            inputRef={field.ref}
            onChange={(date) => field.onChange(moment(date).toDate())}
            slotProps={{
              textField: {
                variant: variant,
                size: size,
                fullWidth: fullWidth,
                helperText: helperText,
                error: error,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default UtmDateTimePicker;
