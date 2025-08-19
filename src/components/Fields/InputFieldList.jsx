import { Grid } from "@mui/material";
import { InputField } from "./InputField";

export const InputFieldList = ({ fields, onUpdate }) => {
  return (
    <Grid container spacing={2} alignItems="center">
      {fields.map((field) => (
        <Grid size={{ xs: 12 }} key={field.id}>
          <InputField field={field} onUpdate={onUpdate} />
        </Grid>
      ))}
    </Grid>
  );
};
