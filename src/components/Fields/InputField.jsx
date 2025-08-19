import { TextField } from "@mui/material";

export const InputField = ({ field, onUpdate }) => {
  return (
    <TextField
      fullWidth
      size="small"
      label={field.label}
      variant="outlined"
      value={field.value}
      onChange={(e) => onUpdate(field.id, { value: e.target.value })}
    />
  );
};
