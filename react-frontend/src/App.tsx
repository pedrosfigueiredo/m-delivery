import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import "./App.css";
import { Mapping } from "./components/Mapping";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <Mapping />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
