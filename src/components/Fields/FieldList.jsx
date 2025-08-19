import { Button, Divider, Grid } from "@mui/material";
import React from "react";
import { Field } from "./Field";

export const FieldList = ({ fields, setFields, onUpdate }) => {
  const onAddField = () => {
    const newField = {
      id: Date.now(),
      label: "Nuevo campo",
      key: "{{id}}",
      value: "",
    };
    setFields((prev) => [...prev, newField]);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid container size={{ xs: 12 }} justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={onAddField}>
          Agregar campo
        </Button>
      </Grid>
      <Grid container size={{ xs: 12 }} spacing={2}>
        {fields.map((field) => (
          <React.Fragment key={field.id}>
            <Field field={field} onUpdate={onUpdate}>
              <Grid size={{ xs: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    setFields(fields.filter((f) => f.id !== field.id))
                  }
                >
                  Eliminar
                </Button>
              </Grid>
            </Field>
            {fields.length > 1 && (
              <Grid size={{ xs: 12 }}>
                <Divider component="hr" style={{ width: "100%" }} />
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Grid>
  );
};
