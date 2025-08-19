import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

export const ProductList = ({ products, onAdd, onUpdate, onRemove }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      onAdd({
        ...newProduct,
        price: parseFloat(newProduct.price),
      });
      setNewProduct({ name: "", price: "", quantity: 1 });
    }
  };

  const handleUpdate = (id, field, value) => {
    onUpdate(id, {
      [field]:
        field === "quantity" || field === "price"
          ? parseFloat(value) || 0
          : value,
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Add Product Form */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Agregar Producto
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Nombre"
              variant="outlined"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              step="0.01"
              min="0"
              label="Precio"
              variant="outlined"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              min="1"
              label="Cantidad"
              variant="outlined"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
            />
          </Grid>
          <Grid container justifyContent="flex-end" size={{ xs: 12, md: 12 }}>
            <Tooltip title="Add Product">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth={isMobile}
              >
                {isMobile ? "Add" : "Add Product"}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Table */}
      {products.length > 0 && (
        <TableContainer component={Paper}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <TextField
                      fullWidth
                      variant="standard"
                      value={product.name}
                      onChange={(e) =>
                        handleUpdate(product.id, "name", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      variant="standard"
                      size="small"
                      inputProps={{ min: "0", step: "0.01" }}
                      value={product.price}
                      onChange={(e) =>
                        handleUpdate(product.id, "price", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      sx={{ maxWidth: 100 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      variant="standard"
                      size="small"
                      inputProps={{ min: "1" }}
                      value={product.quantity}
                      onChange={(e) =>
                        handleUpdate(product.id, "quantity", e.target.value)
                      }
                      sx={{ maxWidth: 70 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    ${(product.price * product.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => onRemove(product.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
