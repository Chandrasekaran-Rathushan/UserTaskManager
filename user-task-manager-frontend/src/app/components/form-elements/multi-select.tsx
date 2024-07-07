import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { ListItem } from "@/app/api/lookupApis";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultiSelectUtiProps {
  name: string;
  label: string;
  value: string[];
  fullWidth?: boolean;
  options: ListItem[];
  handleChange: (event: SelectChangeEvent<string[]>) => void;
  handleMenuClose?:
    | ((event: React.SyntheticEvent<Element, Event>) => void)
    | undefined;
}

const MultiSelectUti: React.FC<MultiSelectUtiProps> = ({
  name,
  value,
  label,
  fullWidth = false,
  options,
  handleChange,
  handleMenuClose,
}) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={`lbl-mselect-${name}`} size="small">
        {label}
      </InputLabel>
      <Select
        name={name}
        size="small"
        labelId={`lbl-mselect-${name}`}
        id={`mselect-${name}`}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
        onClose={handleMenuClose ? handleMenuClose : undefined}
      >
        {options.map((option: ListItem) => (
          <MenuItem key={option.key} value={option.key}>
            <Checkbox checked={value.indexOf(option.key) > -1} />
            <ListItemText primary={option.key} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default MultiSelectUti;
