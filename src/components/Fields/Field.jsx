import { Grid, TextField } from "@mui/material";

export const Field = ({ field, onUpdate, children }) => {
  const handleUpdate = (id, field, value) => {
    console.log(id, field, value);
    onUpdate(id, { [field]: value });
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Etiqueta"
          variant="outlined"
          value={field.label}
          onChange={(e) => handleUpdate(field.id, "label", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Clave"
          variant="outlined"
          value={field.key}
          onChange={(e) => handleUpdate(field.id, "key", e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Valor por defecto"
          variant="outlined"
          value={field.value}
          onChange={(e) => handleUpdate(field.id, "value", e.target.value)}
        />
      </Grid>
      {children}
    </Grid>
  );
};
