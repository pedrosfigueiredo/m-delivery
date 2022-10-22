import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import "./App.css";
import { Mapping } from "./components/Mapping";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Mapping />
    </ThemeProvider>
  );
}

export default App;
