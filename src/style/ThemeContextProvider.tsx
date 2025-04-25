import { useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ThemeContext } from "./ThemeContext";

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<"light" | "dark">(
    () => (localStorage.getItem("themeMode") as "light" | "dark") || "dark"
  );

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1976d2",
            contrastText: "#ffffff",
          },
          background: {
            default: mode === "dark" ? "#1a1a1a" : "#fefefe",
            paper: mode === "dark" ? "#2a2a2a" : "#fafafa",
          },
          text: {
            primary: mode === "dark" ? "#e0e0e0" : "#212121",
          },
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              },
            },
          },
          MuiFilledInput: {
            styleOverrides: {
              root: {
                backgroundColor: "#fafafa",
                color: "#000000",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
                "&.Mui-focused": {
                  backgroundColor: "#fafafa",
                  borderColor: "#1976d2",
                  boxShadow: "0 0 0 1px #1976d2",
                },
              },
              input: {
                color: mode === "dark" ? "#000000" : "#000000",
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: mode === "dark" ? "#b0b0b0" : "#606060",
                "&.Mui-focused": {
                  color: "#1976d2",
                },
                fontSize: 13,
              },
            },
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--background-color",
      mode === "dark" ? "#121212" : "#ffffff"
    );
    root.style.setProperty(
      "--text-color",
      mode === "dark" ? "#ffffff" : "#000000"
    );
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
