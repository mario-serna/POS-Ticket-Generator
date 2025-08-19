import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppContextProvider } from "./context/app.context";
import { TabsContextProvider } from "./context/tabs.context";
import { FirebaseAdapter } from "./firebase/FirebaseAdapter";
import "./index.css";

const firebaseAdapter = new FirebaseAdapter();

// Create a basic theme
const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#fff",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider firebaseAdapter={firebaseAdapter}>
        <TabsContextProvider>
          <CssBaseline />
          <App />
        </TabsContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
